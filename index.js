import * as web3 from '@solana/web3.js';

async function sendSolana() {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const provider = window.solana;

  if (!provider) {
    alert('Please install Phantom wallet!');
    return;
  }

  await provider.connect();
  const fromWallet = provider.publicKey;
  const toWallet = new web3.PublicKey('Recipient-Solana-Address'); // Replace with the recipient's address
  const amount = 1 * web3.LAMPORTS_PER_SOL; // Convert SOL to lamports

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: toWallet,
      lamports: amount,
    })
  );

  try {
    const signature = await provider.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signature.serialize());
    await connection.confirmTransaction(txid, 'confirmed');
    console.log('Transaction successful with signature:', txid);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

document.getElementById('sendSolanaButton').addEventListener('click', sendSolana);
