# API Reference Overview

The Flutterwave Node.js SDK provides a comprehensive interface to all Flutterwave v4 API endpoints. All API methods are accessible through the `flutterwave.api` object.

## Available APIs

### Payment & Collection

- **[Charges](/api/charges)** - Create and manage payment charges
- **[Orders](/api/orders)** - Create and manage payment orders
- **[Orchestration](/api/orchestration)** - Direct charge and order creation without pre-creating customers/payment methods
- **[Payment Methods](/api/payment-methods)** - Store and manage customer payment methods
- **[Virtual Accounts](/api/virtual-accounts)** - Create and manage virtual bank accounts for receiving payments

### Money Movement

- **[Transfers](/api/transfers)** - Send money to bank accounts, mobile money, and wallets
- **[Transfer Recipients](/api/transfer-recipients)** - Manage transfer beneficiaries
- **[Transfer Senders](/api/transfer-senders)** - Manage transfer sender information
- **[Transfer Rates](/api/transfer-rates)** - Get exchange rates for cross-currency transfers
- **[Refunds](/api/refunds)** - Process refunds for completed transactions

### Account Management

- **[Customers](/api/customers)** - Create and manage customer records
- **[Wallets](/api/wallets)** - Check balances and manage wallet operations
- **[Settlements](/api/settlements)** - View settlement information

### Supporting Services

- **[Banks](/api/banks)** - List banks, branches, and resolve account details
- **[Fees](/api/fees)** - Calculate transaction fees
- **[Mobile Networks](/api/mobile-networks)** - Get mobile money network information
- **[Chargebacks](/api/chargebacks)** - Manage payment disputes and chargebacks

## Common Patterns

### Authentication

All API methods automatically handle authentication. The SDK manages access token generation and refresh transparently.

```typescript
const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key',
});

// All API calls are automatically authenticated
const banks = await flutterwave.api.banks.list('NG');
```

### Trace IDs

Most API methods accept an optional `traceId` parameter for request tracking:

```typescript
const traceId = 'trace-' + Date.now();
const transfer = await flutterwave.api.transfers.retrieve(
  'transfer_id',
  traceId,
);
```

### Idempotency

Create operations (transfers, charges, orders) support idempotency keys to prevent duplicate transactions:

```typescript
const idempotencyKey = 'idem-' + Date.now();
const transfer = await flutterwave.api.transfers.directTransfer(
  transferData,
  traceId,
  idempotencyKey,
);
```

### Pagination

List endpoints return paginated results with cursor-based or offset-based pagination:

```typescript
const result = await flutterwave.api.transfers.list({
  page: 1,
  size: 20,
});

console.log(result.data); // Array of transfers
console.log(result.cursor); // Pagination cursor
```

### Error Handling

The SDK throws typed exceptions for different error scenarios:

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
  ForbiddenRequestException,
} from 'flutterwave-node-v4';

try {
  const transfer = await flutterwave.api.transfers.directTransfer(data);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed:', error.message);
  }
}
```

## Response Format

All API methods return typed responses based on the endpoint. The SDK automatically extracts the data from Flutterwave's response envelope.

```typescript
// Flutterwave returns: { status: 'success', message: '...', data: {...} }
// SDK returns just the data object with proper typing
const transfer: ITransfer = await flutterwave.api.transfers.retrieve('id');
```

## Type Safety

The SDK provides comprehensive TypeScript definitions for all API methods:

```typescript
import type {
  ITransfer,
  IDirectTransferForm,
  ICustomer,
  IVirtualAccount,
} from 'flutterwave-node-v4/contracts';

const transferData: IDirectTransferForm = {
  action: 'instant',
  type: 'bank',
  // TypeScript provides autocomplete and validation
  payment_instruction: {
    // ...
  },
};
```

## Next Steps

Browse the individual API documentation pages for detailed information about each endpoint, including:

- Available methods
- Request parameters
- Response types
- Code examples
- Best practices
