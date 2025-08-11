# Parent Web Application

React-based frontend for parents to:
- View live bus location
- Receive notifications
- See assigned routes for their children

## Features
- Firebase Authentication via custom token
- Live map using Google Maps API or Mapbox
- Responsive, mobile-friendly UI
- Dark mode support

## Tech Stack
- React
- Tailwind CSS
- Firebase Web SDK
- Map API (Google or Mapbox)

## Environment Variables
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_DB_URL=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
```

## Run Locally
```bash
npm install
npm start
```

## Deployment

* Deploy via Firebase Hosting:

```bash
firebase deploy --only hosting
```

* Or host on any static hosting service.

## Notes

* Ensure `/auth/token` from Subscription Manager provides Firebase config and token.
