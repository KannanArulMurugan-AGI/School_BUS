# Driver App (Android/Kotlin)

Android application for school bus drivers to:
- Authenticate using QR code or tenant ID
- Send live GPS updates to Firebase
- Manage assigned routes

## Features
- Firebase Authentication (custom token)
- Background location tracking
- Configurable GPS update frequency
- Offline mode (caches updates)

## Tech Stack
- Kotlin
- Firebase Android SDK
- Android Location APIs

## Setup
1. Obtain `google-services.json` from Subscription Manager or Firebase project.
2. Add to `app/` directory.

## Build
Open in Android Studio:
```

File -> Open -> driver-app
```
Then build & run.

## Firebase Writes
Driver writes to:
```
/schools/{tenantId}/routes/{routeId}/live
```

## Permissions
- Location (foreground + background)
- Internet
