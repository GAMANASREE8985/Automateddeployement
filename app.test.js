const app = require('./app');  // Make sure this path is correct
const request = require('supertest');

let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

test('GET / should return Hello message', async () => {
  const response = await request(server).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Hello'); // Adjust to your actual response
});
