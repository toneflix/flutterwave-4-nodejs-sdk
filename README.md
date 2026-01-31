# Flutterwave Node.js SDK v4

[![npm version](https://badge.fury.io/js/flutterwave-node-v4.svg)](https://www.npmjs.com/package/flutterwave-node-v4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The unofficial Flutterwave Node.js SDK for v4 APIs. This library provides a simple and intuitive way to integrate Flutterwave payment services into your Node.js applications.

## Features

- **Full API Coverage** - Support for all documented Flutterwave v4 endpoints
- **Type-Safe** - Written in TypeScript with comprehensive type definitions
- **Intuitive API** - Clean and easy-to-use interface
- **Lightweight** - Minimal dependencies
- **Promise-based** - Modern async/await support
- **Error Handling** - Comprehensive error handling with custom exceptions

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
  - [Transfers](#transfers)
  - [Virtual Accounts](#virtual-accounts)
  - [Wallets](#wallets)
  - [Banks](#banks)
  - [Settlements](#settlements)
- [Error Handling](#error-handling)
- [Webhook Validation](#webhook-validation)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# Using npm
npm install flutterwave-node-v4

# Using yarn
yarn add flutterwave-node-v4

# Using pnpm
pnpm add flutterwave-node-v4
```

## Getting Started

### Quick Start

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

// Initialize with individual parameters
const flutterwave = new Flutterwave(
  'your_client_id',
  'your_client_secret',
  'your_encryption_key', // optional
  'sandbox', // 'sandbox' or 'live'
);

// Or initialize with options object
const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key', // optional
  environment: 'sandbox', // 'sandbox' or 'live'
});

// Make your first API call
const banks = await flutterwave.api.banks.list('NG');
console.log(banks);
```

### Configuration

The SDK can be configured using environment variables or by passing options directly:

```typescript
// Using environment variables
// CLIENT_ID=your_client_id
// CLIENT_SECRET=your_client_secret
// ENCRYPTION_KEY=your_encryption_key
// ENVIRONMENT=sandbox  # or 'live'

const flutterwave = new Flutterwave();

// Pass credentials as individual parameters
const flutterwave = new Flutterwave(
  'your_client_id',
  'your_client_secret',
  'your_encryption_key', // optional
  'sandbox', // optional: 'sandbox' or 'live', defaults to 'live'
);

// Or pass as an options object
const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key', // optional
  environment: 'sandbox', // optional: 'sandbox' or 'live', defaults to 'live'
});
```

## Authentication

The SDK automatically handles authentication using your client credentials. All API requests are authenticated, and the SDK manages token refresh automatically.

## Usage Examples

### Transfers

#### Create a Direct Transfer

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  reference: 'unique-ref-' + Date.now(),
  narration: 'Payment for services',
  type: 'bank',
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 10000,
      applies_to: 'source_currency',
    },
    recipient: {
      bank: {
        account_number: '0690000031',
        code: '044',
      },
    },
    sender: {
      name: {
        first: 'John',
        last: 'Doe',
      },
    },
  },
});

console.log('Transfer ID:', transfer.id);
console.log('Status:', transfer.status);
```

#### List Transfers

```typescript
const result = await flutterwave.api.transfers.list(
  {
    page: 1,
    size: 20,
  },
  'trace-id', // optional
);

console.log(`Found ${result.data.length} transfers`);
```

#### Retrieve a Transfer

```typescript
const transfer = await flutterwave.api.transfers.retrieve(
  'transfer_id',
  'trace-id', // optional
);
```

### Virtual Accounts

#### Create a Virtual Account

```typescript
const virtualAccount = await flutterwave.api.virtualAccounts.create({
  reference: 'va-ref-' + Date.now(),
  customer_id: 'customer_id_here',
  amount: 1000,
  currency: 'NGN',
  account_type: 'static',
});

console.log('Account Number:', virtualAccount.account_number);
console.log('Bank Name:', virtualAccount.bank_name);
```

#### List Virtual Accounts

```typescript
const accounts = await flutterwave.api.virtualAccounts.list({
  page: 1,
  size: 10,
});
```

### Wallets

#### Get Wallet Balance

```typescript
// Get balance for specific currency
const ngnBalance = await flutterwave.api.wallets.balance('NGN');
console.log('Available:', ngnBalance.available_balance);
console.log('Total:', ngnBalance.total_balance);

// Get all balances
const allBalances = await flutterwave.api.wallets.balances();
```

#### Resolve Account

```typescript
const account = await flutterwave.api.wallets.accountResolve({
  account_number: '0690000031',
  bank_code: '044',
});

console.log('Account Name:', account.account_name);
```

### Banks

#### List Banks

```typescript
const banks = await flutterwave.api.banks.list('NG');

banks.forEach((bank) => {
  console.log(`${bank.name} - ${bank.code}`);
});
```

#### Get Bank Branches

```typescript
const branches = await flutterwave.api.banks.branches('bank_id');
```

### Settlements

#### List Settlements

```typescript
const result = await flutterwave.api.settlements.list(
  {
    page: 1,
    size: 20,
  },
  'trace-id', // optional
);
```

#### Retrieve Settlement

```typescript
const settlement = await flutterwave.api.settlements.retrieve(
  'settlement_id',
  'trace-id', // optional
);
```

## Error Handling

The SDK provides custom exceptions for different error scenarios:

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
  ForbiddenRequestException,
} from 'flutterwave-node-v4';

try {
  const transfer = await flutterwave.api.transfers.create({
    // ... transfer data
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof ForbiddenRequestException) {
    console.error('Access denied:', error.message);
  } else {
    console.error('An error occurred:', error);
  }
}
```

## Webhook Validation

Validate webhook signatures to ensure they're from Flutterwave:

```typescript
import { WebhookValidator } from 'flutterwave-node-v4';

const validator = new WebhookValidator('your_secret_hash');

// In your webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['verif-hash'];

  if (validator.validate(signature)) {
    // Process the webhook
    const event = req.body;
    console.log('Webhook event:', event);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

## API Reference

The SDK provides access to all Flutterwave v4 APIs:

- **Banks** - `flutterwave.api.banks`
- **Charges** - `flutterwave.api.charges`
- **Chargebacks** - `flutterwave.api.chargebacks`
- **Customers** - `flutterwave.api.customers`
- **Fees** - `flutterwave.api.fees`
- **Mobile Networks** - `flutterwave.api.mobileNetworks`
- **Orchestration** - `flutterwave.api.orchestration`
- **Orders** - `flutterwave.api.orders`
- **Payment Methods** - `flutterwave.api.paymentMethods`
- **Refunds** - `flutterwave.api.refunds`
- **Settlements** - `flutterwave.api.settlements`
- **Transfer Rates** - `flutterwave.api.transferRates`
- **Transfer Recipients** - `flutterwave.api.transferRecipients`
- **Transfers** - `flutterwave.api.transfers`
- **Transfer Senders** - `flutterwave.api.transferSenders`
- **Virtual Accounts** - `flutterwave.api.virtualAccounts`
- **Wallets** - `flutterwave.api.wallets`

For detailed API documentation, visit [https://flutterwave.toneflix.net](https://flutterwave.toneflix.net)

## TypeScript Support

This SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  ITransfer,
  IVirtualAccount,
  IDirectTransferForm,
} from 'flutterwave-node-v4/contracts';

const transferData: IDirectTransferForm = {
  action: 'instant',
  payment_instruction: {
    // TypeScript will provide autocomplete and type checking
  },
};
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/toneflix/flutterwave-4-nodejs-sdk.git
cd flutterwave-4-nodejs-sdk

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://flutterwave.toneflix.net)
- 🐛 [Report Issues](https://github.com/toneflix/flutterwave-4-nodejs-sdk/issues)
- 💬 [Discussions](https://github.com/toneflix/flutterwave-4-nodejs-sdk/discussions)

## Credits

Maintained by [Toneflix](https://github.com/toneflix)

---

**Note:** This is an unofficial SDK. For the official Flutterwave SDK and documentation, visit [Flutterwave Developers](https://developer.flutterwave.com).
