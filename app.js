const express = require("express");
const cors = require("cors");
const { Connection, PublicKey, Transaction, SystemProgram } = require("@solana/web3.js");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Health Check
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Generate latest blockhash (optional utility)
app.get("/blockhash", async (req, res) => {
    try {
        const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const blockhash = await connection.getLatestBlockhash();
        res.json({ blockhash: blockhash.blockhash });
    } catch (error) {
        res.status(500).json({ error: "Failed to get blockhash" });
    }
});

app.post("/sendSol", async (req, res) => {
    const { fromPublicKey, toPublicKey, amount } = req.body;

    try {
        const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

        // Create the transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(fromPublicKey),
                toPubkey: new PublicKey(toPublicKey),
                lamports: amount * 1e9, // Convert SOL to lamports
            })
        );

        transaction.feePayer = new PublicKey(fromPublicKey);
        const blockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash.blockhash;

        // Sign the transaction
        const signedTransaction = await window.solana.signTransaction(transaction);

        // Send transaction
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

        res.json({ success: true, signature });
    } catch (error) {
        console.error("Transaction failed:", error);
        res.status(500).json({ error: "Transaction failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
