# Technical Specification: City Search Autocomplete

## Overview
This feature adds a real-time city search autocomplete to the Weather app. It will provide users with a list of suggestions as they type in the search bar, improving user experience and reducing errors in city name entry.

## Features
- Dynamic dropdown list appearing below the search input.
- Real-time filtering based on user input.
- Selection of a city from the list updates the search field and triggers a weather lookup.
- 'Debounced' API calls to Geocoding service to minimize unnecessary network traffic.

## File Structure & Tech Stack
- **HTML**: `index.html` (update to include a container for suggestions).
- **CSS**: `style.css` (UI for the dropdown menu).
- **JS**: `app.js` (logic for fetching and display suggestions).
- **API**: [OpenWeatherMap Geocoding API](https://openweathermap.org/api/geocoding-api) or similar.

## Data Model
`Suggestion` object:
- `name`: City name
- `state`: State/Province (optional)
- `country`: Country code
- `lat`: Latitude
- `lon`: Longitude

## Edge Cases
- No results found: Display "No cities found".
- Network errors: Gracefully hide suggestions and allow manual entry.
- Rapid typing: Debounce input for 300ms.
- Keyboard navigation: (Optional/Future) support arrow keys to select.

## Testing Criteria
- Typing "Lon" should suggest "London, GB", "London, ON, CA", etc.
- Clicking a suggestion should populate the search box and load weather.
- Emptying the search box should hide the suggestions.
