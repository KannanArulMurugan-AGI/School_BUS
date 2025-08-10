const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const db = require('./db');
const firebase = require('./firebase');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware Setup ---

// Apply essential security headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Use express's built-in body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all HTTP requests using morgan, piped through our winston logger
app.use(morgan('combined', { stream: logger.stream }));


// --- Routes ---

app.get('/', (req, res) => {
  res.send('Subscription Manager is running!');
});

app.post('/subscribe', async (req, res) => {
  try {
    const { name, adminEmail, plan } = req.body;

    if (!name || !adminEmail || !plan) {
      logger.warn('Subscription attempt with missing fields', { body: req.body });
      return res.status(400).json({ error: 'Missing required fields: name, adminEmail, plan' });
    }

    // In a real application, you would first process the payment via a gateway like Stripe.
    logger.info('Payment processing placeholder for tenant:', name);

    // Create a tenant record in the database
    const newTenant = await db.createTenant({ name, adminEmail, plan });
    logger.info(`New tenant created with id: ${newTenant.id}`);

    // Initialize the tenant's namespace in Firebase
    await firebase.initializeTenantNamespace(newTenant.id);
    logger.info(`Firebase namespace initialized for tenant: ${newTenant.id}`);

    res.status(201).json({
      message: 'Subscription successful!',
      tenant: newTenant,
    });
  } catch (error) {
    logger.error('Error during subscription:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/token', async (req, res) => {
  try {
    const { userId, tenantId, role } = req.body;

    if (!userId || !tenantId || !role) {
      logger.warn('Token generation attempt with missing fields', { body: req.body });
      return res.status(400).json({ error: 'Missing required fields: userId, tenantId, role' });
    }

    // In a real application, you would first validate the user's credentials
    logger.info(`Token generation requested for userId: ${userId} in tenant: ${tenantId}`);

    const customClaims = {
      tenantId: tenantId,
      role: role,
    };

    // Create a custom Firebase token with the claims
    const customToken = await firebase.createCustomToken(userId, customClaims);
    logger.info(`Custom token generated for userId: ${userId}`);

    res.status(200).json({
      message: 'Custom token generated successfully!',
      token: customToken,
    });
  } catch (error) {
    logger.error('Error generating custom token:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Admin Middleware (Placeholder) ---
const adminOnly = (req, res, next) => {
  // In a real app, you would validate a JWT and check the 'role' claim.
  if (req.headers['x-admin-auth'] === 'true') {
    next();
  } else {
    logger.warn('Forbidden access attempt to admin route', { ip: req.ip, path: req.path });
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};


// --- Admin Routes ---

app.get('/tenant/:id', adminOnly, (req, res) => {
  const { id } = req.params;
  logger.info(`Fetching details for tenant: ${id}`);
  res.status(200).json({
    id,
    name: `Mock School ${id}`,
    admin_email: `admin@${id}.com`,
    plan: 'premium',
    status: 'active',
  });
});

app.get('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    logger.info(`Fetching routes for tenant: ${tenantId}`);
    res.status(200).json([
        { id: 'route-1', name: 'Morning Route', tenantId },
        { id: 'route-2', name: 'Evening Route', tenantId },
    ]);
});

app.post('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    const { name } = req.body;
    if (!name) {
        logger.warn(`Route creation failed for tenant ${tenantId} due to missing name`);
        return res.status(400).json({ error: 'Missing required field: name' });
    }
    logger.info(`Creating route for tenant ${tenantId} with name: ${name}`);
    res.status(201).json({
        message: 'Route created successfully',
        route: { id: `route-${Date.now()}`, name, tenantId },
    });
});

app.post('/tenant/:id/notify', adminOnly, (req, res) => {
  const { id: tenantId } = req.params;
  const { message } = req.body;

  if (!message) {
    logger.warn(`Notification failed for tenant ${tenantId} due to missing message`);
    return res.status(400).json({ error: 'Missing required field: message' });
  }

  logger.info(`Sending notification to tenant ${tenantId}: "${message}"`);
  res.status(200).json({
    message: 'Notification sent successfully!',
  });
});

app.listen(port, () => {
  logger.info(`Subscription Manager listening at http://localhost:${port}`);
});

module.exports = app; // Export for testing purposes
