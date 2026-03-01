// Weather Dashboard Application

// API Configuration - Using Open-Meteo (free, no API key required)
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherContent = document.getElementById('weatherContent');

// Current Weather Elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const description = document.getElementById('description');

// Forecast Elements
const forecastGrid = document.getElementById('forecastGrid');

// Search History
const historyList = document.getElementById('historyList');

// State
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
        fetchWeather(lastCity);
    }
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    await fetchWeather(city);
}

async function fetchWeather(city) {
    showLoading();
    hideError();

    try {
        // First, get coordinates from city name
        const geoResponse = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try a different search.');
        }
        
        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        // Now get weather data
        const weatherResponse = await fetch(
            `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max&timezone=auto&forecast_days=6`
        );

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        
        displayCurrentWeather(weatherData.current, name, country);
        displayForecast(weatherData.daily);
        addToHistory(name);
        
        // Save last searched city
        localStorage.setItem('lastSearchedCity', name);
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

function displayCurrentWeather(current, city, country) {
    cityName.textContent = `${city}, ${country}`;
    currentDate.textContent = formatDate(new Date());
    temp.textContent = Math.round(current.temperature_2m);
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    
    const weatherCode = current.weather_code;
    const weatherInfo = getWeatherInfo(weatherCode);
    description.textContent = weatherInfo.description;
    weatherIcon.src = weatherInfo.icon;
    weatherIcon.alt = weatherInfo.description;
}

function displayForecast(daily) {
    forecastGrid.innerHTML = '';
    
    const times = daily.time;
    const weatherCodes = daily.weather_code;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const humidities = daily.relative_humidity_2m_max;

    // Skip today (index 0), show next 5 days
    for (let i = 1; i <= 5; i++) {
        const date = new Date(times[i]);
        const weatherCode = weatherCodes[i];
        const weatherInfo = getWeatherInfo(weatherCode);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="day">${formatDay(date)}</div>
            <img class="icon" src="${weatherInfo.icon}" alt="${weatherInfo.description}">
            <div class="temp">${Math.round(maxTemps[i])}°C</div>
            <div class="humidity"><i class="fas fa-tint"></i> ${humidities[i]}%</div>
        `;
        
        forecastGrid.appendChild(card);
    }
}

function addToHistory(city) {
    // Remove if already exists
    searchHistory = searchHistory.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to front
    searchHistory.unshift(city);
    
    // Keep only last 10
    searchHistory = searchHistory.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    
    loadSearchHistory();
}

function loadSearchHistory() {
    historyList.innerHTML = '';
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<span class="history-item">No recent searches</span>';
        return;
    }
    
    searchHistory.forEach(city => {
        const item = document.createElement('span');
        item.className = 'history-item';
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        historyList.appendChild(item);
    });
}

// Helper Functions
function getWeatherInfo(code) {
    const weatherMap = {
        0: { description: 'Clear sky', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
        1: { description: 'Mainly clear', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
        2: { description: 'Partly cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
        3: { description: 'Overcast', icon: 'https://openweathermap.org/img/wn/03d@2x.png' },
        45: { description: 'Foggy', icon: 'https://openweathermap.org/img/wn/50d@2x.png' },
        48: { description: 'Foggy', icon: 'https://openweathermap.org/img/wn/50d@2x.png' },
        51: { description: 'Light drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
        53: { description: 'Moderate drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
        55: { description: 'Dense drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
        61: { description: 'Slight rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
        63: { description: 'Moderate rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
        65: { description: 'Heavy rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
        71: { description: 'Slight snow', icon: 'https://openweathermap.org/img/wn/13d@2x.png' },
        73: { description: 'Moderate snow', icon: 'https://openweatherma}
