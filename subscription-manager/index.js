/**
 * @fileoverview This file contains the main Express application for the
 * Subscription Manager service. It defines the API endpoints for managing
 * subscriptions and generating authentication tokens.
 * @module index
 */

const express = require('express');
const db = require('./db');
const firebase = require('./firebase');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

/**
 * Route serving a welcome message for the service root.
 * @name GET /
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
app.get('/', (req, res) => {
  res.send('Subscription Manager is running!');
});

/**
 * Route for creating a new tenant subscription.
 * @name POST /subscribe
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.name - The name of the school or tenant.
 * @param {string} req.body.adminEmail - The email of the administrator.
 * @param {string} req.body.plan - The subscription plan (e.g., 'basic', 'premium').
 * @param {object} res - Express response object.
 */
app.post('/subscribe', async (req, res) => {
  try {
    const { name, adminEmail, plan } = req.body;

    if (!name || !adminEmail || !plan) {
      return res.status(400).json({ error: 'Missing required fields: name, adminEmail, plan' });
    }

    const newTenant = await db.createTenant({ name, adminEmail, plan });
    await firebase.initializeTenantNamespace(newTenant.id);

    res.status(201).json({
      message: 'Subscription successful!',
      tenant: newTenant,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error during subscription:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Route for generating a custom Firebase authentication token.
 * @name POST /auth/token
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userId - The user's unique ID.
 * @param {string} req.body.tenantId - The ID of the tenant the user belongs to.
 * @param {string} req.body.role - The user's role (e.g., 'driver', 'parent', 'admin').
 * @param {object} res - Express response object.
 */
app.post('/auth/token', async (req, res) => {
  try {
    const { userId, tenantId, role } = req.body;

    if (!userId || !tenantId || !role) {
      return res.status(400).json({ error: 'Missing required fields: userId, tenantId, role' });
    }

    const customClaims = { tenantId, role };
    const customToken = await firebase.createCustomToken(userId, customClaims);

    res.status(200).json({
      message: 'Custom token generated successfully!',
      token: customToken,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error generating custom token:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Middleware to protect routes that require admin access.
 * In a real app, this would validate a JWT. This mock checks for a header.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const adminOnly = (req, res, next) => {
  if (req.headers['x-admin-auth'] === 'true') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};


// --- Admin Routes ---

/**
 * Route for getting tenant details. (Admin only)
 * @name GET /tenant/:id
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {string} req.params.id - The ID of the tenant to retrieve.
 * @param {object} res - Express response object.
 */
app.get('/tenant/:id', adminOnly, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    id,
    name: `Mock School ${id}`,
    admin_email: `admin@${id}.com`,
    plan: 'premium',
    status: 'active',
  });
});

/**
 * Route for getting a tenant's routes. (Admin only)
 * @name GET /tenant/:id/routes
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {string} req.params.id - The ID of the tenant.
 * @param {object} res - Express response object.
 */
app.get('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    res.status(200).json([
        { id: 'route-1', name: 'Morning Route', tenantId },
        { id: 'route-2', name: 'Evening Route', tenantId },
    ]);
});

/**
 * Route for creating a new route for a tenant. (Admin only)
 * @name POST /tenant/:id/routes
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {string} req.params.id - The ID of the tenant.
 * @param {object} req.body - The request body.
 * @param {string} req.body.name - The name of the new route.
 * @param {object} res - Express response object.
 */
app.post('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Missing required field: name' });
    }
    res.status(201).json({
        message: 'Route created successfully',
        route: { id: `route-${Date.now()}`, name, tenantId },
    });
});

/**
 * Route for sending a notification to a tenant. (Admin only)
 * @name POST /tenant/:id/notify
 * @function
 * @memberof module:index
 * @inner
 * @param {object} req - Express request object.
 * @param {string} req.params.id - The ID of the tenant.
 * @param {object} req.body - The request body.
 * @param {string} req.body.message - The notification message.
 * @param {object} res - Express response object.
 */
app.post('/tenant/:id/notify', adminOnly, (req, res) => {
  const { id: tenantId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing required field: message' });
  }

  console.log(`[NOTIFY MOCK] Sending notification to tenant ${tenantId}: "${message}"`);
  res.status(200).json({
    message: 'Notification sent successfully!',
  });
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Subscription Manager listening at http://localhost:${port}`);
  });
}

module.exports = app;
