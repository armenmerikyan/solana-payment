const express = require('express');
const path = require('path');
const app = express();
const port = 8081;

// Serve static files from the 'dist' or 'public' folder
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve the pay_with_sol.html page
app.get('/pay_with_sol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pay_with_sol.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
