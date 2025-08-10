const request = require('supertest');
const app = require('./index');
const db = require('./db');
const firebase = require('./firebase');

// Mock the external dependencies
jest.mock('./db', () => ({
  createTenant: jest.fn(),
}));

jest.mock('./firebase', () => ({
  initializeTenantNamespace: jest.fn(),
}));

describe('POST /subscribe', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    db.createTenant.mockClear();
    firebase.initializeTenantNamespace.mockClear();
  });

  it('should create a new tenant and return 201 on successful subscription', async () => {
    const tenantData = {
      name: 'Test School',
      adminEmail: 'admin@test.com',
      plan: 'premium',
    };

    const mockNewTenant = {
      id: 'tenant-12345',
      ...tenantData,
      status: 'active',
    };

    // Set up the mock implementations
    db.createTenant.mockResolvedValue(mockNewTenant);
    firebase.initializeTenantNamespace.mockResolvedValue();

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Subscription successful!');
    expect(response.body.tenant).toEqual(mockNewTenant);

    // Verify that the external functions were called correctly
    expect(db.createTenant).toHaveBeenCalledTimes(1);
    expect(db.createTenant).toHaveBeenCalledWith(tenantData);
    expect(firebase.initializeTenantNamespace).toHaveBeenCalledTimes(1);
    expect(firebase.initializeTenantNamespace).toHaveBeenCalledWith(mockNewTenant.id);
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/subscribe')
      .send({ name: 'Test School' }); // Missing adminEmail and plan

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required fields: name, adminEmail, plan');

    // Ensure no external calls were made
    expect(db.createTenant).not.toHaveBeenCalled();
    expect(firebase.initializeTenantNamespace).not.toHaveBeenCalled();
  });

  it('should return 500 if the database operation fails', async () => {
    const tenantData = {
      name: 'Test School',
      adminEmail: 'admin@test.com',
      plan: 'premium',
    };

    // Mock a failure in the database
    const dbError = new Error('Database connection lost');
    db.createTenant.mockRejectedValue(dbError);

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');

    // Ensure firebase initialization was not attempted
    expect(firebase.initializeTenantNamespace).not.toHaveBeenCalled();
  });

  it('should return 500 if the Firebase operation fails', async () => {
    const tenantData = {
      name: 'Test School',
      adminEmail: 'admin@test.com',
      plan: 'premium',
    };

    const mockNewTenant = { id: 'tenant-12345', ...tenantData };
    const firebaseError = new Error('Firebase permission denied');

    // Mock a successful DB call followed by a failed Firebase call
    db.createTenant.mockResolvedValue(mockNewTenant);
    firebase.initializeTenantNamespace.mockRejectedValue(firebaseError);

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
