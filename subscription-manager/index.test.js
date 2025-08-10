const request = require('supertest');
const app = require('./index'); // Import the Express app

describe('Subscription Manager API', () => {
  it('should return a welcome message on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Subscription Manager is running!');
  });
});
