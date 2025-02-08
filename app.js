const express = require('express');
const path = require('path');
const app = express();
const port = 8081;  // Set to port 8081 as per your NGINX config

// Serve static files from the 'dist' directory (where app.js, etc. are located)
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve the 'pay_with_sol.html' page when visiting /pay_with_sol
app.get('/pay_with_sol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pay_with_sol.html'));
});

// Start the server on port 8081
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
