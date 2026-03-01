# Weather Dashboard - Design Notes

## Overview
Modern glassmorphism design for a weather dashboard application with a dark gradient background and frosted glass card effects.

## Visual Style

### Color Palette
- **Background**: Deep blue gradient (#1a1a2e → #16213e → #0f3460)
- **Glass Effect**: Semi-transparent white (8% opacity) with blur
- **Accent Colors**:
  - Cyan (#00d4ff) for interactive elements
  - Orange (#ff6b35) for wind indicators
  - Yellow (#ffd93d) for temperature
- **Text**: White primary, 70% white secondary, 50% white muted

### Typography
- Font: Segoe UI (system fallback: -apple-system, BlinkMacSystemFont)
- Title: 2.5rem bold with gradient text
- Temperature: 4rem bold in accent yellow
- Body: 1rem, line-height 1.6

### Components

#### Search Box
- Full-width input with left icon
- Glass background with border
- Cyan glow on focus
- Rounded corners (24px)

#### Weather Cards
- Frosted glass effect (backdrop-filter: blur)
- Subtle border (15% white)
- Hover: slight lift and glow

#### Current Weather
- Large animated weather icon (bounce)
- City name and date
- Large temperature display
- Grid of details: humidity, wind, conditions

#### Forecast Cards
- 5-card horizontal grid
- Each shows: day, icon, temp, humidity
- Hover: lift effect with cyan border

#### Search History
- Pill-shaped clickable items
- Hover: cyan highlight

## Animations
- **Page Load**: Staggered fadeInUp (header → search → current → forecast → history)
- **Weather Icon**: Gentle bounce (2s loop)
- **Error**: Shake animation
- **Hover**: Transform and shadow transitions

## Responsive Breakpoints
- **Desktop** (>768px): Full 5-day forecast
- **Tablet** (768px): 3-day forecast
- **Mobile** (480px): 2-day forecast, stacked layout

## Implementation Notes
- Uses CSS custom properties for theming
- Mobile-first approach with progressive enhancement
- Smooth 60fps animations using transform/opacity
- Accessible focus states on all interactive elements
