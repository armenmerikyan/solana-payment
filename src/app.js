// Check if Phantom is available
const connectButton = document.getElementById("connect-wallet");
const sendButton = document.getElementById("send-sol");

let connection, wallet;

const SOLANA_NETWORK = "mainnet-beta"; // Use testnet or devnet for testing

// Connect to Phantom Wallet
connectButton.addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      await window.solana.connect();
      console.log("Connected to Phantom Wallet:", window.solana.publicKey.toString());
      connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(SOLANA_NETWORK));
      wallet = window.solana;
    } catch (err) {
      console.error("Connection failed", err);
    }
  } else {
    alert("Please install Phantom Wallet!");
  }
});

// Send SOL from Phantom wallet
sendButton.addEventListener("click", async () => {
  if (!wallet) {
    alert("Connect to Phantom Wallet first.");
    return;
  }

  const recipientAddress = "RecipientSolanaAddress"; // Replace with the recipient's address
  const amount = 0.1; // Amount in SOL

  try {
    const fromPublicKey = wallet.publicKey;
    const toPublicKey = new solanaWeb3.PublicKey(recipientAddress);
    
    // Create a transaction to send SOL
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: solanaWeb3.LAMPORTS_PER_SOL * amount, // Convert SOL to lamports
      })
    );
    
    // Send the transaction
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log("Transaction successful with signature:", signature);
  } catch (err) {
    console.error("Transaction failed", err);
  }
});
