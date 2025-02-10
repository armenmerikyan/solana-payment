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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
