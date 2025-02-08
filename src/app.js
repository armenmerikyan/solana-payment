const express = require('express');
const path = require('path');
const { Buffer } = require('buffer');  // Ensure Buffer is imported
const { Connection, clusterApiUrl, Transaction, PublicKey, SystemProgram } = require('@solana/web3.js');

const app = express();
const port = 8081;

// Middleware to handle JSON requests
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up Solana connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Serve the index.html page at /pay_with_sol
app.get('/pay_with_sol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to /pay_with_sol for processing the payment
app.post('/pay_with_sol', async (req, res) => {
  try {
    const { transaction } = req.body;

    if (!transaction) {
      return res.status(400).send("No transaction found.");
    }

    // Decode the signed transaction and send it to the blockchain
    const decodedTransaction = Transaction.from(Buffer.from(transaction, 'base64'));
    

    // Send the transaction
    const signature = await connection.sendRawTransaction(decodedTransaction.serialize());

    // Confirm the transaction
    await connection.confirmTransaction(signature, 'confirmed');

    // Send a response with the transaction signature
    res.json({ message: "Payment processed successfully!", transactionSignature: signature });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing payment.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
