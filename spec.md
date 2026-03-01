# Technical Specification: Weather Dashboard App

## Project Overview
A modern, responsive web-based Weather Dashboard that allows users to search for a city and view current weather conditions along with a 5-day forecast. The app will consume data from a public weather API (OpenWeatherMap) and provide a clean, glassmorphism-inspired interface.

## Features
- **City Search**: Input field to search for weather by city name.
- **Current Weather Display**:
    - City Name & Date
    - Temperature (Celsius)
    - Humidity (%)
    - Wind Speed (m/s or km/h)
    - Weather Icon (e.g., sunny, rainy, cloudy)
- **5-Day Forecast**:
    - A row of cards showing the forecast for the next 5 days.
    - Each card includes: Date, Icon, Temp, and Humidity.
- **Search History**: List of recently searched cities that are clickable to re-fetch weather.
- **Persistent State**: Save the last searched city in `localStorage` to load on refresh.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Modern/Glassmorphism), Vanilla JavaScript (ES6+).
- **API**: [OpenWeatherMap Geocoding API](https://openweathermap.org/api/geocoding-api) and [5 Day / 3 Hour Forecast API](https://openweathermap.org/forecast5).
- **Deployment**: GitHub Pages.

## File Structure
```
weather-mas-v1/
├── index.html      # Main entry point
├── style.css       # Provided by UX Agent
├── app.js         # Logic for API calls and DOM manipulation
├── README.md       # Project documentation
└── spec.md         # This specification
```

## Data Model (OpenWeatherMap)
- **Current/Forecast Data**: Extracted from the `list` array in the 5-day forecast response (filtering for ~12:00 PM slots for the daily forecast).
- **Icons**: Derived from `weather[0].icon` mapping to OpenWeatherMap icon URLs.

## Edge Cases
- **Invalid City**: Show an error message if the city is not found.
- **Network Error**: Handle API failure gracefully.
- **Empty Input**: Prevent search if the input field is empty.
- **API Key**: Use a placeholder or a provided key (implementation should allow easy replacement).

## Testing Criteria
1.  Searching for "London" displays current stats and 5 distinct forecast cards.
2.  Clicking a city in the search history updates the dashboard.
3.  The layout is responsive on mobile and desktop.
4.  Refreshing the page loads the last searched city's data.
