const express = require('express');
const path = require('path');
const app = express();
const port = 8081;

// Serve static files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.js'));
});

// Serve the payment page under '/pay_with_sol'
app.get('/pay_with_sol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pay_with_sol.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
