# Stride — Fitness Tracker

A responsive React fitness tracker for logging workouts, manually entered steps, meals, daily goals, and a lightweight wellness check-in. It also includes a live city weather page powered by Open-Meteo.

## Requirements

- Node.js 18 or newer
- npm
- VS Code (recommended)

## Run locally

1. Open this project folder in VS Code.
2. Open **Terminal → New Terminal**.
3. In the VS Code PowerShell terminal, install dependencies:

   ```powershell
   npm.cmd install
   ```

4. Start the development server:

   ```powershell
   npm.cmd run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build, run `npm.cmd run build`. To preview that build locally, run `npm.cmd run preview`. Using `npm.cmd` avoids PowerShell script-policy restrictions on some Windows setups.

## Try the app

1. Choose **Create account**, enter a name, email, and password (at least 6 characters), and submit. You can also sign out and sign back in with those details.
2. From **Overview**, check the daily summary and use the quick actions to open other sections.
3. In **Steps & calories**, enter a step count. The dashboard and progress chart will update.
4. In **Workouts**, add an activity and duration; edit or remove it from workout history. The calorie figure is an illustrative estimate based on duration, not a sensor reading.
5. In **Nutrition**, add breakfast, lunch, dinner, or snacks with calorie values. The daily intake total updates automatically.
6. In **My goals**, change the daily step and workout-minute targets. Progress and achievement messages update with your entries.
7. In **Wellness**, use the water buttons to keep a simple daily glass count and review general tips.
8. In **Weather**, search for a city to load current conditions and a five-day forecast. This feature needs an internet connection.
9. Refresh the browser to verify that account and fitness entries remain available. **Log out** from the profile at the bottom of the desktop sidebar.

## Data and measurement notes

- Authentication is frontend-only for project demonstration. Account information and the password are stored in this browser's local storage; this is **not secure authentication** and must not be used for real accounts or sensitive data.
- Fitness records are stored locally per email address. Clearing browser storage removes them; they are not synced between devices.
- Steps and food calories are manually entered. Workout calories are illustrative estimates (duration × 5.2 kcal/min). No fitness records come from a sensor.
- Weather results are fetched from the public Open-Meteo geocoding and forecast APIs. Weather requires internet access and may be unavailable if that service is unreachable.
- The wellness content is general information, not medical advice.
