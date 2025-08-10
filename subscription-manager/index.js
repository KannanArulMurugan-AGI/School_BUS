const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const firebase = require('./firebase');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Subscription Manager is running!');
});

app.post('/subscribe', async (req, res) => {
  try {
    const { name, adminEmail, plan } = req.body;

    if (!name || !adminEmail || !plan) {
      return res.status(400).json({ error: 'Missing required fields: name, adminEmail, plan' });
    }

    // In a real application, you would first process the payment via a gateway like Stripe.
    // const paymentResult = await paymentGateway.process({ ... });
    // if (!paymentResult.success) {
    //   return res.status(402).json({ error: 'Payment failed' });
    // }

    // Create a tenant record in the database
    const newTenant = await db.createTenant({ name, adminEmail, plan });

    // Initialize the tenant's namespace in Firebase
    await firebase.initializeTenantNamespace(newTenant.id);

    res.status(201).json({
      message: 'Subscription successful!',
      tenant: newTenant,
    });
  } catch (error) {
    console.error('Error during subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/token', async (req, res) => {
  try {
    const { userId, tenantId, role } = req.body;

    if (!userId || !tenantId || !role) {
      return res.status(400).json({ error: 'Missing required fields: userId, tenantId, role' });
    }

    // In a real application, you would first validate the user's credentials
    // or session against your user database.
    // const user = await db.findUserById(userId);
    // if (!user || user.tenant_id !== tenantId) {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }

    const customClaims = {
      tenantId: tenantId,
      role: role,
    };

    // Create a custom Firebase token with the claims
    const customToken = await firebase.createCustomToken(userId, customClaims);

    res.status(200).json({
      message: 'Custom token generated successfully!',
      token: customToken,
    });
  } catch (error) {
    console.error('Error generating custom token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Admin Middleware (Placeholder) ---
const adminOnly = (req, res, next) => {
  // In a real app, you would validate a JWT and check the 'role' claim.
  // For this mock, we'll just check for a specific header.
  if (req.headers['x-admin-auth'] === 'true') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};


// --- Admin Routes ---

// Get Tenant Details
app.get('/tenant/:id', adminOnly, (req, res) => {
  const { id } = req.params;
  // In a real app, you would fetch this from the database.
  res.status(200).json({
    id,
    name: `Mock School ${id}`,
    admin_email: `admin@${id}.com`,
    plan: 'premium',
    status: 'active',
  });
});

// Manage Tenant Routes
app.get('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    // In a real app, you would fetch this from the database.
    res.status(200).json([
        { id: 'route-1', name: 'Morning Route', tenantId },
        { id: 'route-2', name: 'Evening Route', tenantId },
    ]);
});

app.post('/tenant/:id/routes', adminOnly, (req, res) => {
    const { id: tenantId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Missing required field: name' });
    }
    // In a real app, you would save this to the database.
    res.status(201).json({
        message: 'Route created successfully',
        route: { id: `route-${Date.now()}`, name, tenantId },
    });
});

// Send Notification to Tenant
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

app.listen(port, () => {
  console.log(`Subscription Manager listening at http://localhost:${port}`);
});

module.exports = app; // Export for testing purposes
