# Driver App

This directory contains the Android/Kotlin application for drivers. Its primary purpose is to capture and publish GPS location data in real-time.

## Key Features (from Phase 4 Plan)

- **Onboarding:**
  - Scan QR code or manually enter a tenant ID.
  - Authenticate with the backend to receive a Firebase custom token.
  - Initialize the Firebase SDK for real-time communication.
- **GPS Tracking:**
  - Request necessary location permissions from the user.
  - Run a foreground service to track location continuously.
  - Push GPS updates to `/schools/{tenantId}/live/{routeId}`.
  - Implement configurable update intervals (e.g., every 5-10 seconds) and distance thresholds.
- **Offline Mode:**
  - Cache GPS updates locally using a Room database if the network is unavailable.
  - Automatically sync cached data to Firebase when connectivity is restored.
- **User Interface:**
  - A minimal interface showing the assigned route, tracking status (on/off), and connection health.
  - Controls to start and stop the tracking service.

## Architecture

The application will follow the **Model-View-ViewModel (MVVM)** architecture pattern to ensure a clean separation of concerns, improve testability, and facilitate UI development.

- **View:** Activities and Fragments (UI layer).
- **ViewModel:** Manages UI-related data and exposes it to the View. Survives configuration changes.
- **Model:** Represents the data and business logic (Repository pattern, services, data sources).

## Core Dependencies

The project will be built using Kotlin and will rely on the following core libraries:

- **UI:**
  - `androidx.appcompat`: For compatibility.
  - `com.google.android.material:material`: For Material Design components.
  - `androidx.constraintlayout:constraintlayout`: For flexible layouts.
- **Architecture Components:**
  - `androidx.lifecycle:lifecycle-viewmodel-ktx`: For ViewModel.
  - `androidx.lifecycle:lifecycle-livedata-ktx`: For observable data.
- **Networking & Services:**
  - `com.google.firebase:firebase-database-ktx`: For real-time data synchronization.
  - `com.google.firebase:firebase-auth-ktx`: For authentication.
  - `com.squareup.retrofit2:retrofit`: For making API calls to the backend (e.g., for authentication).
- **Location:**
  - `com.google.android.gms:play-services-location`: For high-accuracy, low-power location tracking.
- **Offline Storage:**
  - `androidx.room:room-runtime` and `androidx.room:room-ktx`: For local database caching.
- **QR Code Scanning:**
  - `com.journeyapps:zxing-android-embedded`: For easy QR code scanner integration.

## Getting Started (for Developers)

1.  **Clone the repository.**
2.  **Set up your local environment:**
    -   Install Android Studio (latest stable version recommended).
    -   Ensure you have the Android SDK, build-tools, and emulator set up.
3.  **Firebase Setup:**
    -   This project requires a `google-services.json` file from the Firebase project to build correctly. Place it in the `app/` directory once the project structure is created.
4.  **Build the project:**
    -   Open the project in Android Studio.
    -   Let Gradle sync the dependencies.
    -   Build and run the app on an emulator or a physical device.
