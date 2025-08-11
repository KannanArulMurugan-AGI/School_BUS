# Parent Web Application

This is the parent-facing web application for the School Bus Tracking System. It provides parents with a secure and easy-to-use interface to monitor the real-time location of their child's school bus.

## Technology Stack

-   **Frontend:** React, Create React App
-   **Styling:** Tailwind CSS
-   **Real-time Data:** Firebase Realtime Database
-   **Mapping:** Google Maps API (or a similar provider like Mapbox)

## Key Features

-   **Secure Onboarding:** Parents register and authenticate to gain access.
-   **Live Map View:** A real-time map displays the current location of the school bus.
-   **Route Information:** Parents can see details of the specific route their child is on.
-   **Real-time Notifications:** A notification system for important alerts (e.g., bus delays).
-   **Responsive Design:** The application is designed to work seamlessly on both desktop and mobile browsers.

---

## Getting Started

### Prerequisites

-   Node.js and npm
-   A running instance of the `subscription-manager` backend service.
-   A Firebase project with the Realtime Database and Authentication enabled.

### Configuration

1.  **Create a `.env.local` file:** In the `parent-web` directory, you can create a `.env.local` file to override the default environment variables. This is a standard feature in Create React App.

2.  **Set Environment Variables:** You will need to configure the following variables:
    -   `REACT_APP_API_BASE_URL`: The URL for the `subscription-manager` backend (e.g., `http://localhost:3000`).
    -   `REACT_APP_FIREBASE_CONFIG`: The JSON configuration object for your Firebase project.
    -   `REACT_APP_MAPS_API_KEY`: The API key for your chosen map provider (e.g., Google Maps).

    Example `.env.local`:
    ```
    REACT_APP_API_BASE_URL=http://localhost:3000
    REACT_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
    REACT_APP_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```

### Running the Application

1.  **Navigate to the directory:**
    ```bash
    cd parent-web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will launch the application in development mode. Open [http://localhost:3001](http://localhost:3001) (or another port if 3001 is in use) to view it in your browser.

---

## Project Structure

-   `public/`: Contains the main `index.html` file.
-   `src/`: Contains the main application source code.
    -   `components/`: Reusable React components (e.g., `MapView`, `Onboarding`).
    -   `services/`: Modules for interacting with external services (e.g., `api.js` for the backend, `firebase.js` for Firebase).
    -   `App.js`: The main application component.
    -   `index.js`: The entry point of the application.
