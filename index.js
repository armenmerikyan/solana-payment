import * as web3 from '@solana/web3.js';

async function sendSolana() {
  // Connect to the Solana devnet (use mainnet for real transactions)
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // Check if the Phantom wallet is installed
  const provider = window.solana;
  if (!provider) {
    alert('Please install a Solana wallet extension like Phantom!');
    return;
  }

  // Connect wallet
  await provider.connect();
  const fromWallet = provider.publicKey;

  // Set up the destination address and amount to send
  const toWallet = new web3.PublicKey('Recipient-Solana-Address'); // Replace with the recipient's address
  const amount = 1 * web3.LAMPORTS_PER_SOL; // 1 SOL (converted to lamports)

  // Create the transaction
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: toWallet,
      lamports: amount,
    })
  );

  // Sign and send the transaction
  try {
    const signature = await provider.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signature.serialize());
    await connection.confirmTransaction(txid, 'processed');
    console.log('Transaction successful with signature:', txid);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

// Set up event listener for the send button
document.getElementById('sendSolanaButton').addEventListener('click', sendSolana);
