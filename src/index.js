import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";

// Initialize Buffer globally
window.Buffer = Buffer;

let userPublicKey = null;

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
        const rpcUrl = 'https://solana-mainnet.g.alchemy.com/v2/brUu7bUWYqnL02KEqM_k1GWoLgTtkGvg'; // Replace with your QuickNode URL
        console.log('RPC URL:', rpcUrl);
        const connection = new Connection(rpcUrl);
                
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
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Sign the transaction
        const signedTransaction = await window.solana.signTransaction(transaction);

        // Send the signed transaction
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

        console.log("Transaction Signature:", signature);
        alert(`Transaction Sent! Check Explorer:\nhttps://explorer.solana.com/tx/${signature}`);
    } catch (err) {
        console.error("Transaction failed:", err);
        alert("Transaction failed! Check console.");
    }
});