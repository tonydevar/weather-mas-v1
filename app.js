// OpenWeatherMap API Configuration
// Note: Replace with your own API key from https://openweathermap.org/api
const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const BASE_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const BASE_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherContent = document.getElementById('weatherContent');
const currentWeather = document.getElementById('currentWeather');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const description = document.getElementById('description');
const forecastGrid = document.getElementById('forecastGrid');
const historyList = document.getElementById('historyList');
const searchHistory = document.getElementById('searchHistory');
const forecast = document.getElementById('forecast');
const suggestionsDropdown = document.getElementById('suggestionsDropdown');

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Debounced input handler for autocomplete
const handleInput = debounce(async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    await fetchSuggestions(query);
}, 300);

cityInput.addEventListener('input', handleInput);

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        hideSuggestions();
    }
});

// Show suggestions dropdown
function showSuggestions() {
    suggestionsDropdown.classList.add('active');
}

// Hide suggestions dropdown
function hideSuggestions() {
    suggestionsDropdown.classList.remove('active');
}

// Fetch city suggestions from Geocoding API
async function fetchSuggestions(query) {
    showLoadingSuggestions();
    
    try {
        const response = await fetch(
            `${BASE_GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            showNoResults();
            return;
        }
        
        displaySuggestions(data);
    } catch (error) {
        showSuggestionsError('Unable to load suggestions');
    }
}

// Display suggestions in dropdown
function displaySuggestions(suggestions) {
    suggestionsDropdown.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        const cityName = suggestion.name;
        const state = suggestion.state ? `${suggestion.state}, ` : '';
        const country = suggestion.country;
        
        item.innerHTML = `
            <div class="suggestion-city">${cityName}</div>
            <div class="suggestion-detail">${state}${country}</div>
        `;
        
        item.addEventListener('click', () => {
            selectSuggestion(suggestion);
        });
        
        suggestionsDropdown.appendChild(item);
    });
    
    showSuggestions();
    hideLoadingSuggestions();
}

// Handle suggestion selection
function selectSuggestion(suggestion) {
    const city = suggestion.name;
    cityInput.value = city;
    hideSuggestions();
    fetchWeather(city);
}

// Show loading state in suggestions
function showLoadingSuggestions() {
    suggestionsDropdown.innerHTML = '<div class="suggestion-loading"><span class="loading-spinner"></span></div>';
    showSuggestions();
}

// Hide loading state
function hideLoadingSuggestions() {
    // Loading is replaced by displaySuggestions
}

// Show no results message
function showNoResults() {
    suggestionsDropdown.innerHTML = '<div class="suggestion-empty">No cities found</div>';
    showSuggestions();
}

// Show error in suggestions
function showSuggestionsError(message) {
    suggestionsDropdown.innerHTML = `<div class="suggestion-error">${message}</div>`;
    showSuggestions();
}

// Load last searched city on page load
document.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    }
});

// Main search handler
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    hideSuggestions();
    await fetchWeather(city);
}

// Fetch weather data from OpenWeatherMap
async function fetchWeather(city) {
    showLoading();
    hideError();
    
    try {
        // Step 1: Get coordinates from Geocoding API
        const geoResponse = await fetch(
            `${BASE_GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData || geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name } = geoData[0];
        
        // Step 2: Get forecast data from 5 Day / 3 Hour Forecast API
        const forecastResponse = await fetch(
            `${BASE_FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Process and display data
        displayCurrentWeather(forecastData, name);
        displayForecast(forecastData);
        addToHistory(name);
        
        // Save to localStorage
        localStorage.setItem('lastCity', name);
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Display current weather
function displayCurrentWeather(data, city) {
    const current = data.list[0];
    const weather = current.weather[0];
    
    cityName.textContent = city;
    currentDate.textContent = formatDate(new Date(current.dt * 1000));
    temp.textContent = Math.round(current.main.temp);
    humidity.textContent = `${current.main.humidity}%`;
    windSpeed.textContent = `${current.wind.speed} m/s`;
    description.textContent = weather.description;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIcon.alt = weather.description;
    
    weatherContent.style.display = 'block';
}

// Display 5-day forecast - filter for ~12:00 PM entries
function displayForecast(data) {
    const forecasts = data.list;
    const dailyForecasts = [];
    const seenDates = new Set();
    
    // Filter for entries around 12:00 PM (11:00 - 14:00) to get one per day
    for (const forecast of forecasts) {
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        const dateStr = date.toISOString().split('T')[0];
        
        // Check if it's around noon (11:00 - 14:00) and we haven't seen this date
        if (hours >= 11 && hours <= 14 && !seenDates.has(dateStr)) {
            seenDates.add(dateStr);
            dailyForecasts.push(forecast);
        }
    }
    
    // If we don't have 5 days yet, fill in with the first available entries
    if (dailyForecasts.length < 5) {
        for (const forecast of forecasts) {
            if (dailyForecasts.length >= 5) break;
            const dateStr = new Date(forecast.dt * 1000).toISOString().split('T')[0];
            if (!seenDates.has(dateStr)) {
                seenDates.add(dateStr);
                dailyForecasts.push(forecast);
            }
        }
    }
    
    // Limit to 5 days
    const fiveDays = dailyForecasts.slice(0, 5);
    
    forecastGrid.innerHTML = '';
    
    fiveDays.forEach(day => {
        const date = new Date(day.dt * 1000);
        const weather = day.weather[0];
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="day-name">${formatDay(date)}</div>
            <div class="date-label">${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}</div>
            <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
            <div class="temp">${Math.round(day.main.temp)}°C</div>
            <div class="humidity"><i class="fas fa-tint"></i> ${day.main.humidity}%</div>
        `;
        
        forecastGrid.appendChild(card);
    });
    
    forecast.style.display = 'block';
}

// Add city to search history
function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // Remove if already exists
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    history.unshift(city);
    
    // Keep only last 5
    history = history.slice(0, 5);
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displayHistory();
}

// Display search history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    if (history.length === 0) {
        searchHistory.style.display = 'none';
        return;
    }
    
    searchHistory.style.display = 'block';
    historyList.innerHTML = '';
    
    history.forEach(city => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        historyList.appendChild(item);
    });
}

// Utility: Format date for display
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Utility: Format day name
function formatDay(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Utility: Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherContent.style.display = 'none';
}

// Utility: Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Utility: Show loading spinner
function showLoading() {
    loading.classList.remove('hidden');
    weatherContent.style.display = 'none';
}

// Utility: Hide loading spinner
function hideLoading() {
    loading.classList.add('hidden');
}

// Initialize history display on load
displayHistory();