# Calorie Tracker

A modern, interactive calorie and nutrition tracker built with React and CSS Glassmorphism. This application helps users monitor their daily calorie intake, macronutrients, and activity levels with a visually appealing, user-friendly interface.

## Features

- **Dashboard Overview**: A comprehensive view of daily progress including calories consumed, burned, and remaining.
- **Interactive Circular Chart**: A visually engaging SVG ring chart that dynamically fills based on calorie consumption.
- **Macronutrient Tracking**: Detailed tracking for Protein, Carbs, and Fats with animated progress bars.
- **Activity Logging**: Easy-to-use interface for logging meals and workouts.
- **Dark Mode Support**: Built-in support for dark mode with smooth transitions.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Live Demo

[![](https://img.shields.io/badge/Live-Demo-success)](https://ngobidi.github.io/CalorieTracker/)

## Tech Stack

- **React**: UI Library
- **Vite**: Build Tool
- **HTML5 / CSS3**: Styling and Animations

## Setup

1.  **Clone the repository** (or download the source code).

2.  **Navigate to the project directory**:

    ```bash
    cd CalorieTracker/Calorie-Tracker-App
    ```

3.  **Install dependencies**:

    ```bash
    npm install
    ```

4.  **Run the development server**:

    ```bash
    npm run dev
    ```

5.  **Open the app** in your browser (usually at `http://localhost:5173`).

## How It Works

The application uses React to manage the state of the user's daily metrics. The `DashboardCard` component renders a main container with a glassmorphic effect, achieved through `backdrop-filter` and a subtle gradient overlay. Data is passed down to the `CircularChart` and `MacroTracker` components, which use SVG and CSS animations to create a dynamic and interactive user experience.
