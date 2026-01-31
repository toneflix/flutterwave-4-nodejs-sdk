---
layout: home

hero:
  name: Flutterwave SDK
  text: Node.js v4 API Integration
  tagline: Type-safe, modern SDK for integrating Flutterwave payment services into your Node.js applications
  image:
    src: /banner.png
    alt: Flutterwave SDK
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/toneflix/flutterwave-4-nodejs-sdk

features:
  - icon: 🚀
    title: Full API Coverage
    details: Support for all documented Flutterwave v4 endpoints including transfers, virtual accounts, wallets, and more.

  - icon: 🔒
    title: Type-Safe
    details: Written in TypeScript with comprehensive type definitions for better developer experience.

  - icon: 🎯
    title: Intuitive API
    details: Clean and easy-to-use interface with promise-based async/await support.

  - icon: 📦
    title: Lightweight
    details: Minimal dependencies with a small footprint for fast installation and execution.

  - icon: 🛡️
    title: Error Handling
    details: Comprehensive error handling with custom exceptions for different scenarios.

  - icon: 🔄
    title: Auto Authentication
    details: Automatic token management and refresh - no need to worry about authentication.

  - icon: 🎨
    title: Developer Friendly
    details: Great IntelliSense support with detailed JSDoc comments and type hints.

  - icon: ⚡
    title: Modern Stack
    details: Built with modern JavaScript/TypeScript features and best practices.

  - icon: 📖
    title: Well Documented
    details: Comprehensive documentation with examples for every API endpoint.
---

## Quick Start

### Installation

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

### Basic Usage

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

// Initialize the SDK
const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key',
});

// Create a transfer
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
```

## Why Choose This SDK?

This SDK is designed with developer experience in mind:

- **Type Safety**: Full TypeScript support means fewer runtime errors
- **Modern**: Uses latest JavaScript features and best practices
- **Tested**: Comprehensive test coverage ensures reliability
- **Maintained**: Regular updates to support new Flutterwave features
- **Open Source**: Community-driven development with transparent roadmap

## Community & Support

- 📖 [Documentation](https://flutterwave.toneflix.net)
- 🐛 [Report Issues](https://github.com/toneflix/flutterwave-4-nodejs-sdk/issues)
- 💬 [Discussions](https://github.com/toneflix/flutterwave-4-nodejs-sdk/discussions)
- 📦 [NPM Package](https://www.npmjs.com/package/flutterwave-node-v4)
