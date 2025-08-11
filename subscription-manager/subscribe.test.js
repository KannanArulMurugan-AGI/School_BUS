const request = require('supertest');
const app = require('./index');
const db = require('./db');
const firebase = require('./firebase');

// Mock the external dependencies
jest.mock('./db', () => ({
  createTenant: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('./firebase', () => ({
  initializeTenantNamespace: jest.fn(),
}));

describe('POST /subscribe', () => {
  const tenantData = {
    name: 'Test School',
    adminEmail: 'admin@test.com',
    plan: 'premium',
  };

  const mockNewTenant = {
    id: 'tenant-12345',
    ...tenantData,
  };

  const mockNewAdmin = {
    id: 'user-67890',
    tenant_id: mockNewTenant.id,
    role: 'admin',
    identifier: tenantData.adminEmail,
  };

  // Clear all mocks before each test
  beforeEach(() => {
    db.createTenant.mockClear();
    db.createUser.mockClear();
    firebase.initializeTenantNamespace.mockClear();
  });

  it('should create a new tenant and an admin user, then return 201', async () => {
    // Set up the mock implementations for a successful run
    db.createTenant.mockResolvedValue(mockNewTenant);
    db.createUser.mockResolvedValue(mockNewAdmin);
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

    expect(db.createUser).toHaveBeenCalledTimes(1);
    expect(db.createUser).toHaveBeenCalledWith({
      tenant_id: mockNewTenant.id,
      role: 'admin',
      identifier: tenantData.adminEmail,
    });

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
    expect(db.createUser).not.toHaveBeenCalled();
    expect(firebase.initializeTenantNamespace).not.toHaveBeenCalled();
  });

  it('should return 500 if the tenant creation fails', async () => {
    // Mock a failure in the database for tenant creation
    const dbError = new Error('Database connection lost');
    db.createTenant.mockRejectedValue(dbError);

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');

    // Ensure subsequent operations were not attempted
    expect(db.createUser).not.toHaveBeenCalled();
    expect(firebase.initializeTenantNamespace).not.toHaveBeenCalled();
  });

  it('should return 500 if the user creation fails', async () => {
    // Mock a successful tenant creation followed by a failed user creation
    const dbError = new Error('Failed to create user');
    db.createTenant.mockResolvedValue(mockNewTenant);
    db.createUser.mockRejectedValue(dbError);

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');

    // Ensure firebase initialization was not attempted
    expect(firebase.initializeTenantNamespace).not.toHaveBeenCalled();
  });

  it('should return 500 if the Firebase operation fails', async () => {
    const firebaseError = new Error('Firebase permission denied');

    // Mock successful DB calls followed by a failed Firebase call
    db.createTenant.mockResolvedValue(mockNewTenant);
    db.createUser.mockResolvedValue(mockNewAdmin);
    firebase.initializeTenantNamespace.mockRejectedValue(firebaseError);

    const response = await request(app)
      .post('/subscribe')
      .send(tenantData);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
