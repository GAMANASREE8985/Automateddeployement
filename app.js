const app = require('./app');
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
  expect(response.text).toBe('Hello'); // or whatever your app returns
});
