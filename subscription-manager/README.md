# Subscription Manager

Backend service responsible for:
- Provisioning new tenants (schools)
- Issuing custom Firebase tokens with tenant-specific claims
- Managing tenant metadata in Postgres
- Providing admin APIs for route/driver/parent management

## Features
- `/subscribe` — onboard a new school
- `/auth/token` — generate a custom Firebase token for client apps
- `/tenant/{id}` — fetch tenant info
- `/tenant/{id}/routes` — manage routes
- `/tenant/{id}/notify` — send in-app notifications

## Tech Stack
- Node.js 18+
- Express
- Firebase Admin SDK
- Postgres
- Docker

## Environment Variables
```
PORT=8080
DATABASE_URL=postgres://user:pass@host:5432/dbname
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_DB_URL=https://<project>.firebaseio.com
```

## Run Locally
```bash
npm install
npm run dev
```

## Deployment

* Build Docker image:

```bash
docker build -t subscription-manager .
```

* Deploy to Cloud Run or Docker host.

## API Documentation

See `/docs/api.md` for endpoint details.
