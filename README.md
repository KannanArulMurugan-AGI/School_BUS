# School Bus Tracking SaaS (School_bus_project)

## Overview
School_bus_project is a SaaS platform that allows schools to track their buses in real-time.
It uses **Firebase Realtime Database** for live GPS updates and **Dockerized backend services** for provisioning tenants (schools).

Each school has:
- A **tenant namespace** in the shared Firebase project (`/schools/{tenantId}/...`)
- Separate roles for **Drivers**, **Parents**, and **Admins**
- A dedicated admin panel (via Subscription Manager or School Runtime)

### Core Modules
1. **Subscription Manager** — backend service for tenant provisioning, authentication, and token issuance.
2. **Parent Web** — web interface for parents to view live bus locations.
3. **Driver App** — Android/Kotlin app for drivers to send GPS updates.
4. **School Runtime** — optional containerized admin runtime for schools.

---

## Architecture
```

[Driver App] -> Firebase (writes GPS) <- [Parent Web]
|                                   ^
v                                   |
[Subscription Manager] -> Postgres <- Admin Dashboard
|
-> Firebase Admin SDK
-> (Optional) School Runtime

```

---

## Tech Stack
- **Backend:** Node.js, Express, Firebase Admin SDK
- **Frontend (Parent Web):** React, Tailwind CSS, Firebase SDK
- **Driver App:** Android/Kotlin, Firebase Android SDK
- **Database:** Firebase Realtime Database + Postgres
- **Deployment:** Docker, Google Cloud Run, GitHub Actions CI/CD

---

## Quick Start
1. Clone repos for each module.
2. Follow each module's README for setup.
3. Ensure Firebase project and Postgres DB are provisioned.
4. Run `Subscription Manager` first, then start web & mobile apps.

---

## Tenant Model (Option B)
- Single Firebase project.
- Data isolated by namespace `/schools/{tenantId}/...`.
- Access control enforced by Firebase rules + custom tokens.

---

## Related Repos
- `subscription-manager/`
- `parent-web/`
- `driver-app/`
- `school-runtime/`
