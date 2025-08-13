# Parent App

This directory is a placeholder for the Android/Kotlin application for parents.

## Phase 5 - Parent App (Android/Kotlin)

**Goal:** Real-time bus tracking for parents.

**Tasks:**

1.  **Onboarding:**
    *   Scan QR or enter tenantId.
    *   Call `/auth/token` to get Firebase custom token.
    *   Initialize Firebase SDK.
2.  **Map View:**
    *   Display a map with the live location of the school bus.
    *   Subscribe to `/schools/{tenantId}/routes/{routeId}/live` for real-time updates.
3.  **Notifications:**
    *   Push notifications for bus arrival, delays, etc.
4.  **UI:**
    *   Clean and simple interface showing the map and relevant information.
