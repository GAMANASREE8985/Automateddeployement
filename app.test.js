const request = require('supertest');
const app = require('./app');

describe('Test root path', () => {
  test('GET / should return Hello message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, Automated Deployment!');
  });
});
