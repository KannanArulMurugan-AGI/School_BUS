# Firebase Realtime Database Data Model

This document outlines the data structure for the School Bus Tracking application in the Firebase Realtime Database. The entire database is a single JSON tree.

## Root Structure

The root of the database will contain a single key: `schools`. All data is namespaced by a `tenantId` (the unique ID for each school).

```json
{
  "schools": {
    "<tenantId>": {
      // ... tenant-specific data
    }
  }
}
```

## Tenant Data Structure

Each tenant has the following top-level nodes:

-   `metadata`: Information about the school/tenant.
-   `routes`: All bus routes for the school.
-   `drivers`: All drivers for the school.
-   `parents`: All parents registered with the school.
-   `children`: All children registered with the school.

### `metadata`
```json
"metadata": {
  "schoolName": "Greenwood Elementary",
  "initializedAt": 1678886400000
}
```

### `routes`
Each route has static information and a `live` object for real-time data.
```json
"routes": {
  "<routeId>": {
    "name": "Morning Lark Route",
    "driverId": "<driverId>",
    "stops": {
      "0": { "name": "Main St & 1st Ave", "lat": 34.0522, "lng": -118.2437 },
      "1": { "name": "Oak St & 2nd Ave", "lat": 34.0532, "lng": -118.2447 }
    },
    "live": {
      "lat": 34.0525,
      "lng": -118.2440,
      "timestamp": 1678886400000
    }
  }
}
```

### `drivers`
```json
"drivers": {
  "<driverId>": {
    "name": "John Doe",
    "contact": "555-1234",
    "assignedRouteId": "<routeId>"
  }
}
```

### `children`
```json
"children": {
  "<childId>": {
    "name": "Jane Smith",
    "routeId": "<routeId>",
    "parentId": "<parentId>"
  }
}
```

### `parents`
Each parent has a list of their children's IDs.
```json
"parents": {
  "<parentId>": {
    "name": "Alice Smith",
    "email": "alice@example.com",
    "children": {
      "<childId>": true
    }
  }
}
```

This data model allows us to:
-   Get the live location of a bus for a specific route.
-   Find a parent's children.
-   From a child, find their assigned route.
-   This solves the problem of the hardcoded `routeId` in `MapView.js`. We can now look up the logged-in parent, find their child, find the child's route, and subscribe to that route's live data.
