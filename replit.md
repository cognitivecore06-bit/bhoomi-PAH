# Bhoomi - Smart Irrigation

A comprehensive agriculture management mobile application built with React Native and Expo (SDK 54), targeting farmers in the Marathi-speaking region. It provides a central interface for monitoring soil moisture, managing irrigation valves, tracking fertigation, analyzing solar energy usage, and receiving AI-driven agricultural advice.

## Tech Stack

- **Framework**: React Native with Expo (SDK 54)
- **Navigation**: expo-router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: @tanstack/react-query
- **Styling**: React Native StyleSheet
- **Icons**: @expo/vector-icons (Feather, Ionicons, MaterialCommunityIcons)
- **Backend/Services**: Firebase
- **Internationalization**: English, Hindi, Marathi support
- **Package Manager**: pnpm

## Project Structure

- `app/` - Core routing directory with expo-router
  - `app/(tabs)/` - Main tab-based navigation screens
  - `app/_layout.tsx` - Root layout with providers
- `screens/` - Screen implementations (HomeScreen, AIChatScreen, etc.)
- `components/` - Reusable UI elements
- `store/useStore.ts` - Zustand state management with mock data
- `hooks/` - Custom React hooks (useWeather, useColors)
- `i18n/` - Localization files (en.ts, hi.ts, mr.ts)
- `server/` - Production static file server
- `scripts/` - Build scripts

## Running the App

The app runs on port 5000 using the workflow "Start application".

```
PORT=5000 pnpm run dev
```

This starts the Expo web dev server on port 5000.

## Deployment

- **Build**: `pnpm run build` - Creates static build in `static-build/`
- **Serve**: `PORT=5000 pnpm run serve` - Serves the static build

Deployment is configured as autoscale with the serve command.
