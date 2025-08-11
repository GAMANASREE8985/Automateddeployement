const express = require('express');
const app = express();

// Define root route
app.get('/', (req, res) => {
  res.send('Hello');
});

// Only start the server if this file is run directly (not during testing)
if (require.main === module) {
  app.listen(3000, () => {
    console.log('App running on http://localhost:3000');
  });
}

module.exports = app;
