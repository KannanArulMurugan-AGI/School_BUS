# Driver App

This directory is a placeholder for the Android/Kotlin application for drivers.

## Phase 4 - Driver App (Android/Kotlin)

**Goal:** GPS data capture & publishing.

**Tasks:**

1.  **Onboarding:**
    *   Scan QR or enter tenantId.
    *   Call `/auth/token` to get Firebase custom token.
    *   Initialize Firebase SDK.
2.  **GPS tracking:**
    *   Request location permission.
    *   Push updates to `/schools/{tenantId}/routes/{routeId}/live` every 5–10 seconds or on movement > X meters.
3.  **Offline mode:**
    *   Cache updates locally, sync when online.
4.  **UI:**
    *   Minimal interface: route info, status, start/stop tracking.
