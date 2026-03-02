# Weather App Design Specification

## Overview
Glassmorphism-based weather dashboard with autocomplete city search.

## Design System

### Color Palette
- **Primary Gradient**: `#6dd5ed` → `#2193b0` (aqua blue gradient)
- **Glass Background**: `rgba(255, 255, 255, 0.12)`
- **Glass Border**: `rgba(255, 255, 255, 0.18)`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `rgba(255, 255, 255, 0.7)`
- **Accent**: `#6dd5ed`

### Typography
- **Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: 1.5rem - 2rem, weight 600
- **Body**: 1rem, weight 400
- **Small/Labels**: 0.875rem

### Visual Effects
- **Glassmorphism**: `backdrop-filter: blur(10px)` on cards
- **Shadows**: `0 8px 32px rgba(0, 0, 0, 0.15)`
- **Borders**: 1px solid with 0.18 opacity white
- **Border Radius**: 8px (sm), 12px (md), 16px (lg)
- **Animations**: Fade-in with staggered delays (30ms intervals)

## Components

### Header
- Centered layout with icon + title
- Subtitle in secondary text color

### Search Box
- Glass-styled input with search icon
- Integrated search button
- Autocomplete dropdown with blur effect

### Current Weather Card
- Large weather icon
- City name + date
- Temperature (large display)
- Grid of details (humidity, wind, description)

### Forecast Section
- Grid of 5-day forecast cards
- Hover lift effect on cards

### Search History
- Pill-shaped history items
- Hover highlight effect

## Responsive Breakpoints
- **Mobile** (< 600px): Single column, stacked search button
- **Desktop** (> 600px): Full layout with side-by-side elements

## Accessibility
- High contrast mode support
- Reduced motion support
- Proper focus states with accent color ring