const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('should respond with a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Subscription Manager is running!');
  });
});
