const express = require('express');
const app = express();

// your middleware/routes here

// Only start server if run directly
if (require.main === module) {
  app.listen(3000, () => {
    console.log('App running on http://localhost:3000');
  });
}

module.exports = app;  // Export the app instance
