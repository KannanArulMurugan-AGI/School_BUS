# School Runtime

Optional containerized service for:
- School-specific admin dashboard
- Localized control over routes, drivers, and parents

## Features
- Web admin panel
- Route management UI
- Driver/parent account management
- Reporting & analytics

## Tech Stack
- Node.js + Express (backend)
- React/Tailwind (frontend)
- Firebase Web SDK

## Environment Variables
```
PORT=8080
TENANT_ID=school_123
FIREBASE_CONFIG_BASE64=...
```

## Run Locally
```bash
npm install
npm run build
npm start
```

## Docker

```bash
docker build -t school-runtime .
docker run -p 8080:8080 school-runtime
```
