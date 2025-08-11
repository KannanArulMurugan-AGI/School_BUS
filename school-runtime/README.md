# School Runtime Service

This is an optional service within the School Bus Tracking System. It is designed to run tenant-specific logic, background jobs, or custom data processing tasks that are isolated from the main `subscription-manager` service.

## Purpose and Use Cases

In a multi-tenant architecture, some tenants may require custom functionality that does not belong in the core, shared services. The `school-runtime` provides an isolated environment to deploy and run this custom code.

Potential use cases include:
-   **Custom Reporting:** Generating daily or weekly reports specific to a school's needs.
-   **Data Integration:** Syncing data with a tenant's existing Student Information System (SIS).
-   **Scheduled Tasks:** Running nightly jobs to clean up data or archive old routes.
-   **Custom Alerting:** Implementing complex, tenant-specific rules for notifications.

## Architecture

-   **Containerized:** This service is designed to be packaged as a Docker container.
-   **Per-Tenant Deployment (Optional):** For tenants with heavy custom logic, a dedicated instance of this service could be deployed.
-   **On-Demand Execution:** The service can be triggered via API calls from the main backend or run on a schedule.

---

## Getting Started

This service is optional and has not been implemented. The following is a high-level guide for its future development.

1.  **Define Logic:** Implement the desired custom logic as a Node.js or Python application.
2.  **Create a Dockerfile:** Write a `Dockerfile` to containerize the application.
3.  **Deploy:** The container can be deployed to a serverless platform like Google Cloud Run or a container orchestration system like Kubernetes.
4.  **Configuration:** The service would be configured with tenant-specific environment variables to connect to the correct database and Firebase namespaces.
