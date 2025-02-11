import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";

// Initialize Buffer globally
window.Buffer = Buffer;

let userPublicKey = null;

// List of RPC endpoints to rotate between
const rpcUrls = [
    'https://solana-mainnet.g.alchemy.com/v2/QpeMFqGkp289n76vAFR860xjPstkfy5C',
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
];

let currentRpcIndex = 0;
let connection = new Connection(rpcUrls[currentRpcIndex], "confirmed");

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch the latest blockhash
const getLatestBlockhash = async () => {
    const { blockhash } = await connection.getLatestBlockhash();
    return blockhash;
};

// Retry mechanism with exponential backoff and RPC rotation
const sendTransactionWithRetry = async (transaction, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const signedTransaction = await window.solana.signAndSendTransaction(transaction);
            return signedTransaction.signature;
        } catch (err) {
            console.error(`Attempt ${i + 1} failed:`, err);

            if (err.message.includes("429") || err.message.includes("Too Many Requests")) {
                console.warn(`Rate limit exceeded. Retrying (${i + 1}/${retries})...`);
                await delay(1000 * (i + 1)); // Exponential backoff
            } else {
                // Rotate RPC endpoint if necessary
                currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length;
                connection = new Connection(rpcUrls[currentRpcIndex], "confirmed");
                console.warn(`Switching to RPC: ${rpcUrls[currentRpcIndex]}`);
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
            userPublicKey = new PublicKey(response.publicKey.toString());
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

    const { amount, recipientAddress } = window.transactionParams;

    if (!recipientAddress) {
        alert("Recipient address missing in query string!");
        return;
    }

    try {
        const toPublicKey = new PublicKey(recipientAddress);

        // Fetch the latest blockhash
        const blockhash = await getLatestBlockhash();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: toPublicKey,
                lamports: amount * 1e9, // Convert SOL to lamports
            })
        );

        transaction.feePayer = userPublicKey;
        transaction.recentBlockhash = blockhash;

        // Send the transaction with retry logic
        const signature = await sendTransactionWithRetry(transaction);

        console.log("Transaction Signature:", signature);
        alert(`Transaction Sent! Check Explorer:\nhttps://solscan.io/tx/${signature}`);

        window.location.href = `pay-with-solana/?txn=${signature}`;
        
    } catch (err) {
        console.error("Transaction failed:", err);
        alert("Transaction failed! Check console.");
    }
});
