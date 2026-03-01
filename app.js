// Weather Dashboard App
// Uses Open-Meteo API (free, no key required)

const API_BASE = 'https://api.open-meteo.com/v1';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const errorMessage = document.getElementById('errorMessage');
const currentWeather = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const historySection = document.getElementById('historySection');

// Weather display elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const forecastGrid = document.getElementById('forecastGrid');
const historyList = document.getElementById('historyList');

// Geocoding API (Open-Meteo)
async function geocodeCity(city) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found');
    }
    return data.results[0];
}

// Weather API
async function getWeather(lat, lon) {
    const response = await fetch(
        `${API_BASE}/forecast?latitude=${lat}&longitude=${lon}¤t=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max&timezone=auto&forecast_days=6`
    );
    return response.json();
}

// Weather code to description/icon
function getWeatherInfo(code) {
    const weatherCodes = {
        0: { desc: 'Clear sky', icon: '☀️' },
        1: { desc: 'Mainly clear', icon: '🌤️' },
        2: { desc: 'Partly cloudy', icon: '⛅' },
        3: { desc: 'Overcast', icon: '☁️' },
        45: { desc: 'Fog', icon: '🌫️' },
        48: { desc: 'Depositing rime fog', icon: '🌫️' },
        51: { desc: 'Light drizzle', icon: '🌦️' },
        53: { desc: 'Moderate drizzle', icon: '🌦️' },
        55: { desc: 'Dense drizzle', icon: '🌧️' },
        61: { desc: 'Slight rain', icon: '🌧️' },
        63: { desc: 'Moderate rain', icon: '🌧️' },
        65: { desc: 'Heavy rain', icon: '🌧️' },
        71: { desc: 'Slight snow', icon: '🌨️' },
        73: { desc: 'Moderate snow', icon: '🌨️' },
        75: { desc: 'Heavy snow', icon: '❄️' },
        80: { desc: 'Rain showers', icon: '🌦️' },
        95: { desc: 'Thunderstorm', icon: '⛈️' },
    };
    return weatherCodes[code] || { desc: 'Unknown', icon: '❓' };
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Format day name
function formatDay(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Display current weather
function displayCurrentWeather(data, city) {
    const current = data.current;
    const weatherInfo = getWeatherInfo(current.weather_code);
    
    cityName.textContent = city.name + ', ' + city.country;
    currentDate.textContent = formatDate(data.daily.time[0]);
    weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather_code}@2x.png`;
    weatherIcon.alt = weatherInfo.desc;
    temperature.textContent = Math.round(current.temperature_2m);
    weatherDescription.textContent = weatherInfo.desc;
    humidity.textContent = current.relative_humidity_2m + '%';
    windSpeed.textContent = current.wind_speed_10m + ' km/h';
    feelsLike.textContent = Math.round(current.apparent_temperature) + '°C';
    pressure.textContent = current.surface_pressure + ' hPa';
}

// Display forecast
function displayForecast(data) {
    forecastGrid.innerHTML = '';
    const times = data.daily.time.slice(1, 6); // Next 5 days
    const codes = data.daily.weather_code.slice(1, 6);
    const maxTemps = data.daily.temperature_2m_max.slice(1, 6);
    const humidities = data.daily.relative_humidity_2m_max.slice(1, 6);
    
    times.forEach((time, i) => {
        const weatherInfo = getWeatherInfo(codes[i]);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="day">${formatDay(time)}</div>
            <img class="icon" src="https://openweathermap.org/img/wn/${codes[i]}@2x.png" alt="${weatherInfo.desc}">
            <div class="temp">${Math.round(maxTemps[i])}°C</div>
            <div class="humidity">💧 ${humidities[i]}%</div>
        `;
        forecastGrid.appendChild(card);
    });
}

// Display search history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    history.forEach(city => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = city;
        item.onclick = () => {
            cityInput.value = city;
            searchWeather();
        };
        historyList.appendChild(item);
    });
}

// Add to history
function addToHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    history = history.filter(c => c !== cityName);
    history.unshift(cityName);
    history = history.slice(0, 5); // Keep last 5
    localStorage.setItem('weatherHistory', JSON.stringify(history));
}

// Save last searched city
function saveLastCity(city) {
    localStorage.setItem('lastCity', city);
}

// Show/hide sections
function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
    emptyState.style.display = 'none';
    currentWeather.style.display = 'none';
    forecastSection.style.display = 'none';
    errorMessage.style.display = 'none';
}

function showError(msg) {
    showLoading(false);
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
}

function showWeather() {
    showLoading(false);
    currentWeather.style.display = 'block';
    forecastSection.style.display = 'block';
    historySection.style.display = 'block';
}

// Main search function
async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading(true);
    
    try {
        // Geocode
        const geoData = await geocodeCity(city);
        
        // Get weather
        const weatherData = await getWeather(geoData.latitude, geoData.longitude);
        
        // Display
        displayCurrentWeather(weatherData, geoData);
        displayForecast(weatherData);
        showWeather();
        
        // Save to history and localStorage
        addToHistory(geoData.name);
        saveLastCity(geoData.name);
        displayHistory();
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch weather data');
    }
}

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

// Load last city on startup
window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        searchWeather();
    } else {
        showLoading(false);
        emptyState.style.display = 'flex';
    }
    displayHistory();
});