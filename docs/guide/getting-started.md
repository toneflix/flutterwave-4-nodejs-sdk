# Getting Started

This guide will help you install and set up the Flutterwave Node.js SDK in your project.

## Installation

Choose your preferred package manager:

::: code-group

```bash [npm]
npm install flutterwave-node-v4
```

```bash [yarn]
yarn add flutterwave-node-v4
```

```bash [pnpm]
pnpm add flutterwave-node-v4
```

:::

## Quick Start

### 1. Get Your API Credentials

First, you need to obtain your API credentials from the Flutterwave Dashboard:

1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → API
3. Copy your:
   - Client ID
   - Client Secret
   - Encryption Key (optional)

::: warning
Never expose your client secret or encryption key in client-side code or public repositories.
:::

### 2. Initialize the SDK

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave(
  'your_client_id',
  'your_client_secret',
  'your_encryption_key', // optional
);
```

### 3. Make Your First API Call

Let's fetch the list of available banks:

```typescript
async function getBanks() {
  try {
    const banks = await flutterwave.api.banks.list({
      country: 'NG',
    });

    console.log(`Found ${banks.length} banks`);
    banks.forEach((bank) => {
      console.log(`${bank.name} - ${bank.code}`);
    });
  } catch (error) {
    console.error('Error fetching banks:', error);
  }
}

getBanks();
```

## Environment Variables

For better security, it's recommended to use environment variables for your credentials:

### 1. Create a `.env` file

```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ENCRYPTION_KEY=your_encryption_key
```

### 2. Install dotenv (optional)

```bash
npm install dotenv
```

### 3. Load environment variables

```typescript
import 'dotenv/config';
import { Flutterwave } from 'flutterwave-node-v4';

// SDK will automatically read from environment variables
const flutterwave = new Flutterwave();

// Or explicitly pass them
const flutterwave = new Flutterwave(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.ENCRYPTION_KEY,
);
```

## TypeScript Setup

If you're using TypeScript, the SDK provides full type definitions:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';
import type {
  ITransfer,
  IDirectTransferForm,
} from 'flutterwave-node-v4/contracts';

const flutterwave = new Flutterwave({
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY!,
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY!,
});

async function createTransfer() {
  const transferData: IDirectTransferForm = {
    action: 'instant',
    reference: 'ref-' + Date.now(),
    narration: 'Test transfer',
    payment_instruction: {
      type: 'bank',
      bank: {
        source_currency: 'NGN',
        amount: {
          value: 1000,
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
    },
  };

  const transfer: ITransfer =
    await flutterwave.api.transfers.directTransfers(transferData);
  return transfer;
}
```

## CommonJS Usage

While the SDK is built as ES modules, it also works with CommonJS:

```javascript
const { Flutterwave } = require('flutterwave-node-v4');

const flutterwave = new Flutterwave({
  publicKey: 'your_public_key',
  secretKey: 'your_secret_key',
  encryptionKey: 'your_encryption_key',
});

// Use it the same way
flutterwave.api.banks
  .list({ country: 'NG' })
  .then((banks) => console.log(banks))
  .catch((error) => console.error(error));
```

## Next Steps

Now that you have the SDK installed and configured, you can:

- Learn about [Configuration](/guide/configuration) options
- Understand [Authentication](/guide/authentication) handling
- Explore [Error Handling](/guide/error-handling) best practices
- Check out the [API Reference](/api/overview) for all available methods
- Try out the [Examples](/examples/direct-transfers)

## Common Issues

### Module Not Found

If you get a "module not found" error, make sure you've installed the package correctly and your Node.js version is 16.x or higher.

### Authentication Errors

If you're getting authentication errors, verify that:

- Your API credentials are correct
- You're using the right environment (sandbox vs production)
- Your credentials haven't expired

### TypeScript Errors

If you're experiencing TypeScript errors:

- Ensure you're using TypeScript 4.5 or higher
- Check that your `tsconfig.json` has `"moduleResolution": "node"`
- Try installing `@types/node` if not already installed

::: tip
For more detailed troubleshooting, check our [GitHub Issues](https://github.com/toneflix/flutterwave-4-nodejs-sdk/issues) or create a new issue.
:::
