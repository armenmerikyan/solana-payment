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

npm install

```


# Usage

- Sending a Payment
- To send a payment, use the sendPayment function:

```bash
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

```

##  Build and Run the Project
   
```bash 

npm run build

npm run start

```

This project is licensed under the MIT License. See the LICENSE file for details. 
