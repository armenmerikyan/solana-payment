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

let isTransactionSent = false;

const sendTransactionWithRetry = async (transaction, retries = 3) => {
    if (isTransactionSent) {
        console.log("Transaction already sent. Skipping retry.");
        return; // Exit if the transaction has already been sent
    }
    
    for (let i = 0; i < retries; i++) {
        try {
            const signedTransaction = await window.solana.signAndSendTransaction(transaction);
            isTransactionSent = true;  // Set the flag to avoid resending
            return signedTransaction.signature;
        } catch (err) {
            console.error(`Attempt ${i + 1} failed:`, err);

            if (err.message.includes("429") || err.message.includes("Too Many Requests")) {
                console.warn(`Rate limit exceeded. Retrying (${i + 1}/${retries})...`);
                await delay(1000 * (i + 1)); // Implement backoff on retries
            } else {
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

let isWalletConnected = false;
// Connect to Phantom Wallet
if (!document.getElementById("connectWallet").hasListener) {
    document.getElementById("connectWallet").addEventListener("click", async function connectWallet() {
        if (window.solana && window.solana.isPhantom) {
            if (isWalletConnected) return;  // Skip if already connected 
            try {
                const response = await window.solana.connect();
                userPublicKey = new PublicKey(response.publicKey.toString());

                // Update the UI once connected
                document.getElementById("walletAddress").innerText = `Connected Wallet: ${userPublicKey.toString()}`;
                document.getElementById("sendSolana").disabled = false;
                alert("Wallet Connected!");
                isWalletConnected = true;  // Set the flag to true

                // Mark that the listener was added to prevent future additions
                document.getElementById("connectWallet").hasListener = true;
            } catch (err) {
                console.error("Wallet connection failed:", err);
                alert("Wallet connection failed!");
            }
        } else {
            alert("Phantom Wallet not found. Please install it.");
        }
    });
}
let isProcessing = false;
 
document.getElementById("sendSolana").addEventListener("click", async (event) => {
    if (isProcessing) return; // Prevent double-click
    isProcessing = true;

    // Prevent form submission if it's inside a form
    event.preventDefault(); // Only use this if it's inside a form

    if (!userPublicKey) {
        alert("Connect your Phantom Wallet first!");
        isProcessing = false;
        return;
    }

    try {
        const toPublicKey = new PublicKey(recipientAddress);
        const blockhash = await getLatestBlockhash();
        let transaction = new Transaction();

        if (splTokenMint) {
            const mintPublicKey = new PublicKey(splTokenMint);
            const senderTokenAccount = await getAssociatedTokenAddress(mintPublicKey, userPublicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

            const transferInstruction = createTransferInstruction(
                senderTokenAccount, 
                recipientTokenAccount, 
                userPublicKey, 
                Math.round(amount * 10 ** 6)
            );
            transaction.add(transferInstruction);
        } else {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: userPublicKey,
                    toPubkey: toPublicKey,
                    lamports: amount * 1e9,
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
    } finally {
        isProcessing = false;
    }
});
