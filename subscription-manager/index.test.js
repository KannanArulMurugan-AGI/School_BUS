const request = require('supertest');
const app = require('./index'); // The Express app

describe('Subscription Manager API', () => {
  describe('POST /subscribe', () => {
    it('should create a new tenant when given valid data', async () => {
      const res = await request(app)
        .post('/subscribe')
        .send({
          name: 'Test School',
          adminEmail: 'test@school.com',
          plan: 'premium',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Subscription successful!');
      expect(res.body).toHaveProperty('tenant');
      expect(res.body.tenant).toHaveProperty('name', 'Test School');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/subscribe')
        .send({
          name: 'Test School',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Missing required fields: name, adminEmail, plan');
    });
  });

  describe('POST /auth/token', () => {
    it('should generate a custom token for a valid user', async () => {
      const res = await request(app)
        .post('/auth/token')
        .send({
          userId: 'user-123',
          tenantId: 'tenant-abc',
          role: 'driver',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Custom token generated successfully!');
      expect(res.body).toHaveProperty('token', 'mock-firebase-token-for-user-123');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/token')
        .send({
          userId: 'user-123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Missing required fields: userId, tenantId, role');
    });
  });

  describe('GET /tenant/:id', () => {
    it('should return tenant details for an admin', async () => {
      const res = await request(app)
        .get('/tenant/tenant-123')
        .set('x-admin-auth', 'true');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 'tenant-123');
      expect(res.body).toHaveProperty('name', 'Mock School tenant-123');
    });

    it('should return 403 for a non-admin user', async () => {
      const res = await request(app)
        .get('/tenant/tenant-123');
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('error', 'Forbidden: Admin access required');
    });
  });
});
