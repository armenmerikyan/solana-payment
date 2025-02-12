# Solana Payment

A simple and efficient Solana-based payment system for handling transactions on the Solana blockchain. This project demonstrates how to integrate Solana payments into your application, enabling seamless cryptocurrency transactions.

## Features

- **Solana Blockchain Integration**: Leverage the power of the Solana blockchain for fast and low-cost transactions.
- **Simple API**: Easy-to-use functions for sending and receiving payments.
- **Secure Transactions**: Built with security in mind to ensure safe and reliable payments.
- **Cross-Platform**: Works with any application that can interact with the Solana network.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- A Solana wallet with some SOL (for testing, you can use the [Solana Devnet](https://docs.solana.com/clusters#devnet))

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/armenmerikyan/solana-payment.git
   cd solana-payment
   ```

2. Install dependencies:

## Install dependencies:

```bash
yarn install
# or
npm install
```

bash
Copy
yarn install
# or
npm install
Set up your Solana environment:

bash
Copy
solana config set --url devnet
solana airdrop 1  # Request SOL for testing (Devnet only)
Usage
Sending a Payment
To send a payment, use the sendPayment function:

javascript
Copy
import { sendPayment } from './src/payment';

const senderPrivateKey = 'your-private-key';
const recipientAddress = 'recipient-wallet-address';
const amount = 0.1; // Amount in SOL

sendPayment(senderPrivateKey, recipientAddress, amount)
  .then((txId) => {
    console.log(`Payment successful! Transaction ID: ${txId}`);
  })
  .catch((error) => {
    console.error('Payment failed:', error);
  });
Receiving Payments
To check for incoming payments, you can use the checkBalance function:

javascript
Copy
import { checkBalance } from './src/payment';

const walletAddress = 'your-wallet-address';

checkBalance(walletAddress)
  .then((balance) => {
    console.log(`Current balance: ${balance} SOL`);
  })
  .catch((error) => {
    console.error('Failed to check balance:', error);
  });
Configuration
You can configure the project by editing the config.js file:

javascript
Copy
export const SOLANA_NETWORK = 'devnet'; // Options: 'mainnet-beta', 'testnet', 'devnet'
export const COMMITMENT = 'confirmed'; // Options: 'processed', 'confirmed', 'finalized'
Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeatureName).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeatureName).

Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
Solana Documentation

Anchor Framework

The Solana community for their support and resources.
