import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";

// Initialize Buffer globally
window.Buffer = Buffer;

let userPublicKey = null;

// List of RPC endpoints to rotate between
const rpcUrls = [
    'https://solana-mainnet.g.alchemy.com/v2/QpeMFqGkp289n76vAFR860xjPstkfy5C', // Alchemy 
];

let currentRpcIndex = 0;

// Function to get a connection with rotating RPC endpoints
const getConnection = () => {
    const rpcUrl = rpcUrls[currentRpcIndex];
    currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length; // Rotate to the next RPC
    console.log('Using RPC URL:', rpcUrl);
    return new Connection(rpcUrl, "confirmed");
};

// Retry mechanism with exponential backoff
const sendTransactionWithRetry = async (transaction, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = getConnection();
            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            return signature;
        } catch (err) {
            if (err.message.includes("429") || err.message.includes("Too Many Requests")) {
                console.warn(`Rate limit exceeded. Retrying (${i + 1}/${retries})...`);
                await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            } else {
                throw err;
            }
        }
    }
    throw new Error("Failed after retries");
};

// Connect to Phantom Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            userPublicKey = response.publicKey;
            document.getElementById("walletAddress").innerText = `Connected Wallet: ${userPublicKey.toString()}`;
            document.getElementById("sendSolana").disabled = false;
            alert("Wallet Connected!");
        } catch (err) {
            console.error("Wallet connection failed:", err);
            alert("Wallet connection failed!");
        }
    } else {
        alert("Phantom Wallet not found. Please install it.");
    }
});

// Send SOL Transaction
document.getElementById("sendSolana").addEventListener("click", async () => {
    if (!userPublicKey) {
        alert("Connect your Phantom Wallet first!");
        return;
    }

    try {
        const recipientAddress = "3VSPtEBgfrCHS7UoessBx1FF275Gkw3CeQswR9pCZznS"; // Replace with actual recipient address
        const toPublicKey = new PublicKey(recipientAddress);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: toPublicKey,
                lamports: 0.01 * 1e9, // Convert SOL to lamports
            })
        );

        transaction.feePayer = userPublicKey;
        transaction.recentBlockhash = (await getConnection().getLatestBlockhash()).blockhash;

        // Send the transaction with retry logic
        const signature = await sendTransactionWithRetry(transaction);

        console.log("Transaction Signature:", signature);
        alert(`Transaction Sent! Check Explorer:\nhttps://solscan.io/tx/${signature}`);
    } catch (err) {
        console.error("Transaction failed:", err);
        alert("Transaction failed! Check console.");
    }
});