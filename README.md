# Smart Weather Forecasting

Smart Weather Forecasting is a real-time weather forecasting web app built with React, Vite, and Tailwind CSS. It fetches live weather data, shows a 5-day forecast, and gives smart suggestions based on current conditions.

## Prerequisites

- Node.js (install from https://nodejs.org/) and npm must be installed on your system.
- A free OpenWeatherMap API key from https://openweathermap.org/api

## Installation

1. Unzip the project archive (if necessary).
2. Open a terminal and change into the project folder:

```powershell
cd weather-app-v2
```

3. Install dependencies:

```powershell
npm install
```

4. Create a `.env` file in the root of the project and add your API key:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

## Running the app

- Start the development server:

```powershell
npm run dev
```

- After the dev server starts, open your browser to: `http://localhost:5173`

## Live Demo

A hosted live version is available at:
https://weather-app-56p.pages.dev

## Features

- Search weather by city name
- Auto-detect location using browser geolocation
- Displays temperature, humidity, wind speed, pressure, visibility, sunrise & sunset
- Smart weather-based suggestions (e.g. carry umbrella, stay hydrated)
- 5-day forecast
- Toggle between °C and °F — no extra API call, instant conversion
- Dynamic background gradient that changes with weather conditions
- Fully mobile responsive

## Notes

- This project uses React + Vite for the development environment and Tailwind CSS for styling.
- If the default port `5173` is in use, Vite will choose an available port — check the terminal output for the exact URL.
- The `.env` file is not included in the project. You must create it yourself with your own API key.

## Uttaranchal University — Online BCA 6th Sem

- **Name:** Atharv Tanksale
- **Learner ID:** 2313020546
- **Email:** itsatharvtanksale@gmail.com
