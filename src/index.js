import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";
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

// Retry mechanism with RPC rotation
const sendTransactionWithRetry = async (transaction, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const signedTransaction = await window.solana.signAndSendTransaction(transaction);
            return signedTransaction.signature;
        } catch (err) {
            console.error(`Attempt ${i + 1} failed:`, err);

            if (err.message.includes("429") || err.message.includes("Too Many Requests")) {
                console.warn(`Rate limit exceeded. Retrying (${i + 1}/${retries})...`);
                await delay(1000 * (i + 1));
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

// Function to get query parameters
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Get transaction details from query string
const amount = getQueryParam("amount") ? parseFloat(getQueryParam("amount")) : 0.01;
const recipientAddress = getQueryParam("recipient") || "default_recipient_address";
const splTokenMint = getQueryParam("splToken"); // SPL Token mint address

window.transactionParams = { amount, recipientAddress, splTokenMint };

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

// Send SOL or SPL Token
document.getElementById("sendSolana").addEventListener("click", async () => {
    if (!userPublicKey) {
        alert("Connect your Phantom Wallet first!");
        return;
    }

    try {
        const toPublicKey = new PublicKey(recipientAddress);
        const blockhash = await getLatestBlockhash();
        let transaction = new Transaction();
        
        if (splTokenMint) {
            // If SPL Token is provided, send SPL Token instead of SOL
            console.log(`Sending SPL Token: ${splTokenMint}`);

            const mintPublicKey = new PublicKey(splTokenMint);
            const senderTokenAccount = await getAssociatedTokenAddress(mintPublicKey, userPublicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

            console.log(`Sender Token Account: ${senderTokenAccount.toString()}`);
            console.log(`Recipient Token Account: ${recipientTokenAccount.toString()}`);

            // Create SPL Token transfer instruction
            const transferInstruction = createTransferInstruction(
                senderTokenAccount, 
                recipientTokenAccount, 
                userPublicKey, 
                Math.round(amount * 10 ** 6) // Round the amount to the nearest integer
            );
            

            transaction.add(transferInstruction);
        } else {
            // Default: Send SOL transaction
            console.log("Sending SOL");

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: userPublicKey,
                    toPubkey: toPublicKey,
                    lamports: amount * 1e9, // Convert SOL to lamports
                })
            );
        }

        transaction.feePayer = userPublicKey;
        transaction.recentBlockhash = blockhash;

        // Send the transaction with retry logic
        const signature = await sendTransactionWithRetry(transaction);

        console.log("Transaction Signature:", signature);
        alert(`Transaction Sent! Check Explorer:\nhttps://solscan.io/tx/${signature}`);

        window.location.href = `/pay-with-solana/?txn=${signature}`;
    } catch (err) {
        console.error("Transaction failed:", err);
        alert("Transaction failed! Check console.");
    }
});
