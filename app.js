const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Automated Deployment!');
});

app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});

module.exports = app;  // Export for testing
