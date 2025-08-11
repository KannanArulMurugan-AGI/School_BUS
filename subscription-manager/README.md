# Subscription Manager

The Subscription Manager is the central backend service for the Multi-Tenant School Bus Tracking System. It is responsible for handling tenant subscriptions, user authentication, and administrative tasks.

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** Firebase Admin SDK

## Key Features

-   Multi-tenant subscription management.
-   User authentication and issuance of custom Firebase tokens with tenant and role claims.
-   RESTful API for managing tenants, users, and routes.
-   Secure integration with a PostgreSQL database for persistent storage.
-   Integration with Firebase Admin SDK to manage real-time data namespaces.

---

## Getting Started

There are two primary ways to run this service: directly with Node.js or using Docker.

### Prerequisites

-   Node.js and npm (for local execution)
-   Docker and Docker Compose (for containerized execution)
-   A running PostgreSQL database instance.
-   A Firebase project and a service account key.

### Configuration

1.  **Create a `.env` file:** In the `subscription-manager` directory, copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  **Edit `.env`:** Open the `.env` file and fill in the required credentials for your PostgreSQL database and Firebase service account.

### Running Locally with Node.js

1.  **Navigate to the directory:**
    ```bash
    cd subscription-manager
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the server:**
    ```bash
    npm start
    ```
    The server will start on the port defined in your `.env` file, defaulting to 3000.

### Running with Docker

1.  **Navigate to the directory:**
    ```bash
    cd subscription-manager
    ```
2.  **Build and run the container:**
    ```bash
    docker-compose up --build
    ```
    This will build the Docker image and start the service. The `docker-compose.yml` file also includes a service for a PostgreSQL database for convenience.

---

## API Endpoints

### Public Endpoints

-   `POST /subscribe`
    -   Creates a new tenant and an associated admin user.
    -   **Body:** `{ "name": "...", "adminEmail": "...", "plan": "..." }`
    -   **Response:** `201 Created` with the new tenant object.

-   `POST /auth/token`
    -   Validates a user and issues a custom Firebase token.
    -   **Body:** `{ "userId": "...", "tenantId": "...", "role": "..." }`
    -   **Response:** `200 OK` with the custom Firebase token.

### Admin Endpoints

*These endpoints require administrative privileges (currently mocked).*

-   `GET /tenant/:id`: Fetches details for a specific tenant.
-   `GET /tenant/:id/routes`: Fetches all routes for a specific tenant.
-   `POST /tenant/:id/routes`: Creates a new route for a tenant.
-   `POST /tenant/:id/notify`: Sends a notification to a tenant.
