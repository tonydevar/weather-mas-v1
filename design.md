# Design Notes: City Search Autocomplete

## Overview
This document outlines the UI/UX design decisions for the city search autocomplete feature in the Weather app.

## Design Philosophy
- **Glassmorphism**: Modern frosted-glass aesthetic with subtle transparency and blur effects
- **Minimal & Clean**: Focus on clarity with generous whitespace and clear visual hierarchy
- **Responsive**: Adapts seamlessly across all device sizes
- **Accessible**: High contrast support and reduced motion preferences

## Visual Design

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--glass-bg` | `rgba(255, 255, 255, 0.12)` | Input/dropdown background |
| `--glass-border` | `rgba(255, 255, 255, 0.18)` | Borders |
| `--accent-primary` | `#6dd5ed` | Primary accent (cyan) |
| `--accent-secondary` | `#2193b0` | Secondary accent (teal) |
| `--text-primary` | `#ffffff` | Main text |
| `--text-secondary` | `rgba(255, 255, 255, 0.7)` | Secondary text (city details) |

### Typography
- **Font Family**: Inter (system fallback: -apple-system, Segoe UI, Roboto)
- **Search Input**: 1.25rem (20px)
- **City Name**: 1rem (16px), font-weight 500
- **City Detail**: 0.875rem (14px)

### Spacing System
- Base unit: 4px
- Input padding: 16px horizontal, 16px vertical
- Dropdown item padding: 16px
- Gap between city name and detail: 4px

## Components

### Search Input
- Full-width with glassmorphism effect
- Blur backdrop (10px)
- Focus state: elevated border glow with accent color
- Placeholder: "Search for a city..."

### Suggestions Dropdown
- Appears below search input with 8px gap
- Max height: 320px with custom scrollbar
- Backdrop blur (16px) for depth
- Smooth fade-in + slide animation on show

### Suggestion Item
- Hover: subtle background lighten
- Selected: accent-tinted background
- Staggered fade-in animation (30ms delay per item)
- City name + detail (state/country) layout

### States
| State | Visual |
|-------|--------|
| Default | Glass background, subtle border |
| Loading | Spinner icon centered |
| Empty | "No cities found" muted text |
| Error | Red-tinted error message |
| Hover | Background lightens |
| Selected | Accent-tinted background |

## Animations
- **Dropdown**: 250ms fade + translateY
- **Items**: Staggered fade-in (30ms intervals)
- **Focus**: Smooth border/shadow transition (250ms)
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Responsive Breakpoints
- **Mobile (<600px)**: Smaller padding, compact dropdown
- **High Contrast**: Darker backgrounds for visibility
- All breakpoints maintain glassmorphism aesthetic

## Accessibility
- Keyboard navigation ready (visual states only; JS handles selection)
- `prefers-reduced-motion` respected
- `prefers-contrast: high` supported
- Clear visual feedback for all interactive states

## Implementation Notes
- CSS custom properties for easy theming
- `-webkit-backdrop-filter` for Safari support
- Custom scrollbar styling (WebKit only)
- No external dependencies beyond Inter font
