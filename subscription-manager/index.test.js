const request = require('supertest');
const app = require('./index');
const db = require('./db');
const firebase = require('./firebase');

// Mock the external dependencies
jest.mock('./db', () => ({
  findUserById: jest.fn(),
}));

jest.mock('./firebase', () => ({
  createCustomToken: jest.fn(),
}));

describe('Subscription Manager API', () => {
  describe('GET /', () => {
    it('should return a welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Subscription Manager is running!');
    });
  });

  describe('POST /auth/token', () => {
    const authData = {
      userId: 'user-123',
      tenantId: 'tenant-abc',
      role: 'driver',
    };

    beforeEach(() => {
      db.findUserById.mockClear();
      firebase.createCustomToken.mockClear();
    });

    it('should return a custom token on successful validation', async () => {
      const mockUser = { id: authData.userId, tenant_id: authData.tenantId };
      const mockToken = 'fake-firebase-custom-token';

      db.findUserById.mockResolvedValue(mockUser);
      firebase.createCustomToken.mockResolvedValue(mockToken);

      const response = await request(app)
        .post('/auth/token')
        .send(authData);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBe(mockToken);
      expect(db.findUserById).toHaveBeenCalledWith(authData.userId);
      expect(firebase.createCustomToken).toHaveBeenCalledWith(authData.userId, {
        tenantId: authData.tenantId,
        role: authData.role,
      });
    });

    it('should return 403 if user is not found', async () => {
      db.findUserById.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/auth/token')
        .send(authData);

      expect(response.statusCode).toBe(403);
      expect(firebase.createCustomToken).not.toHaveBeenCalled();
    });

    it('should return 403 if user belongs to a different tenant', async () => {
      const mockUser = { id: authData.userId, tenant_id: 'tenant-different' };
      db.findUserById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/token')
        .send(authData);

      expect(response.statusCode).toBe(403);
      expect(firebase.createCustomToken).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({ userId: 'user-123' });

      expect(response.statusCode).toBe(400);
      expect(db.findUserById).not.toHaveBeenCalled();
      expect(firebase.createCustomToken).not.toHaveBeenCalled();
    });
  });
});
