# Driver Application (Android)

This is the Android application for school bus drivers. Its primary purpose is to capture the driver's real-time GPS location and publish it to the Firebase Realtime Database, allowing parents and school administrators to monitor the bus's location.

## Technology Stack

-   **Platform:** Android
-   **Language:** Kotlin
-   **Architecture:** MVVM (Model-View-ViewModel)
-   **Networking:** Retrofit
-   **Local Storage:** Room Database (for offline caching)
-   **Authentication:** Firebase Authentication
-   **Real-time Data:** Firebase Realtime Database
-   **Location Services:** Google Play Services Location API

## Key Features

-   **Secure Onboarding:** Drivers can onboard their device to a specific tenant by scanning a QR code or entering a tenant ID manually.
-   **Custom Authentication:** The app authenticates with the `subscription-manager` backend to receive a custom Firebase token, ensuring tenant isolation.
-   **Real-time GPS Tracking:** A foreground service tracks the bus's location efficiently, even when the app is in the background.
-   **Adaptive Location Updates:** The frequency of GPS updates is adaptive, based on time and distance to conserve battery life.
-   **Robust Offline Mode:** GPS updates are cached locally in a Room database if the device loses internet connectivity. The cached data is automatically synced to Firebase once the connection is restored.
-   **Minimalist UI:** A simple user interface allows the driver to select their route, start and stop tracking, and view their connection status.

---

## Getting Started (for Developers)

This project is not yet initialized. The following steps outline the process for setting up the project.

### Prerequisites

-   Android Studio
-   A running instance of the `subscription-manager` backend service.
-   A Firebase project with the Realtime Database and Authentication enabled.

### Setup and Configuration

1.  **Initialize Project:** Create a new Android Studio project in this directory with Kotlin support and the "Empty Activity" template.

2.  **Add Dependencies:** The following dependencies will need to be added to the `build.gradle` file:
    ```groovy
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:...')
    implementation 'com.google.firebase:firebase-auth-ktx'
    implementation 'com.google.firebase:firebase-database-ktx'

    // Google Play Services for Location
    implementation 'com.google.android.gms:play-services-location:...'

    // Networking
    implementation 'com.squareup.retrofit2:retrofit:...'
    implementation 'com.squareup.retrofit2:converter-gson:...'

    // Local Database
    implementation 'androidx.room:room-runtime:...'
    kapt 'androidx.room:room-compiler:...'
    implementation 'androidx.room:room-ktx:...'

    // ViewModel and LiveData
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:...'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:...'
    ```

3.  **Configure Firebase:**
    -   Add your `google-services.json` file to the `app/` directory of the project.
    -   Configure the Firebase SDK in your Application class.

4.  **Permissions:**
    -   Add the necessary location permissions to the `AndroidManifest.xml`:
        -   `ACCESS_COARSE_LOCATION`
        -   `ACCESS_FINE_LOCATION`
        -   `FOREGROUND_SERVICE` (for newer Android versions)

### Running the Application

Once the project is set up and configured, it can be built and run on an Android emulator or a physical device directly from Android Studio.
