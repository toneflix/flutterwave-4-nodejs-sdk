# Transfers API

The Transfers API allows you to send money to bank accounts, mobile money wallets, and Flutterwave wallets.

## Methods

### directTransfer()

Create a direct transfer using the orchestrator.

```typescript
async directTransfer(
  formData: IDirectTransferForm,
  traceId?: string,
  indempotencyKey?: string,
  scenarioKey?: string
): Promise<ITransfer>
```

#### Parameters

- `formData` - Transfer form data
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicate transfers
- `scenarioKey` - Optional scenario key for testing

#### Example: Bank Transfer

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  reference: 'ref-' + Date.now(),
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

#### Example: Wallet Transfer

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  reference: 'ref-' + Date.now(),
  narration: 'Wallet transfer',
  type: 'wallet',
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 5000,
      applies_to: 'source_currency',
    },
    recipient: {
      wallet: {
        identifier: '00118468',
        provider: 'flutterwave',
      },
    },
    sender: {
      name: {
        first: 'Jane',
        last: 'Smith',
      },
    },
  },
});
```

### create()

Create a transfer using a pre-created recipient.

```typescript
async create(
  formData: ITransferCreateForm,
  traceId?: string,
  indempotencyKey?: string,
  scenarioKey?: string
): Promise<ITransfer>
```

#### Example

```typescript
const transfer = await flutterwave.api.transfers.create({
  action: 'instant',
  reference: 'ref-' + Date.now(),
  narration: 'Payment',
  payment_instruction: {
    source_currency: 'NGN',
    amount: {
      value: 10000,
      applies_to: 'source_currency',
    },
    recipient_id: 'recipient_id_here',
  },
});
```

### list()

List all transfers with optional filters.

```typescript
async list(
  query?: TransfersListQueryParams,
  traceId?: string
): Promise<{ data: ITransfer[], cursor: PageCursor }>
```

#### Parameters

- `query.page` - Page number
- `query.size` - Number of items per page
- `query.status` - Filter by status: `pending`, `new`, `successful`, `failed`, `cancelled`
- `query.type` - Filter by type: `bank`, `wallet`, `mobile_money`, `cash_pickup`
- `query.source_currency` - Filter by source currency
- `query.destination_currency` - Filter by destination currency

#### Example

```typescript
const { data: transfers, cursor } = await flutterwave.api.transfers.list({
  page: 1,
  size: 20,
  status: 'successful',
});

console.log(`Found ${transfers.length} transfers`);
```

### retrieve()

Get details of a specific transfer.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<ITransfer>
```

#### Example

```typescript
const transfer = await flutterwave.api.transfers.retrieve('transfer_id');

console.log('Transfer:', transfer);
console.log('Amount:', transfer.amount);
console.log('Status:', transfer.status);
```

### update()

Update a transfer (e.g., initiate or close).

```typescript
async update(
  id: string,
  formData: ITransferUpdateForm,
  traceId?: string
): Promise<ITransfer>
```

#### Example

```typescript
const updated = await flutterwave.api.transfers.update('transfer_id', {
  initiate: true,
  disburse_option: {
    date_time: new Date(Date.now() + 3600 * 1000).toISOString(),
    timezone: 'UTC',
  },
});
```

### retry()

Retry a failed transfer.

```typescript
async retry(
  id: string,
  formData: ITransferRetryForm,
  traceId?: string,
  indempotencyKey?: string,
  scenarioKey?: string
): Promise<ITransfer>
```

#### Example

```typescript
const retried = await flutterwave.api.transfers.retry('transfer_id', {
  action: 'retry',
});
```

## Type Definitions

### IDirectTransferForm

```typescript
interface IDirectTransferForm {
  action: 'instant' | 'deferred' | 'scheduled';
  reference?: string;
  narration?: string;
  type: 'bank' | 'mobile_money' | 'wallet';
  disburse_option?: {
    date_time?: string;
    timezone?: string;
  };
  callback_url?: string;
  meta?: Record<string, any>;
  payment_instruction: {
    source_currency: CurrencyCode;
    destination_currency: CurrencyCode;
    amount: {
      value: number;
      applies_to: 'source_currency' | 'destination_currency';
    };
    recipient: {
      bank?: { account_number: string; code: string };
      mobile_money?: { network: string; msisdn: string };
      wallet?: { provider: string; identifier: string };
    };
    sender: {
      name: { first: string; last: string };
      email?: string;
      phone?: { country_code: string; number: string };
      address?: Record<string, any>;
    };
  };
}
```

### ITransfer

```typescript
interface ITransfer {
  id: string;
  type: 'bank' | 'mobile_money' | 'wallet' | 'cash_pickup';
  action: 'instant' | 'deferred' | 'scheduled' | 'retry' | 'duplicate';
  reference: string;
  status:
    | 'NEW'
    | 'PENDING'
    | 'FAILED'
    | 'SUCCESSFUL'
    | 'CANCELLED'
    | 'INITIATED';
  narration: string;
  source_currency: CurrencyCode;
  destination_currency: CurrencyCode;
  amount: {
    value: number;
    applies_to: 'source_currency' | 'destination_currency';
  };
  fee: {
    total: number;
    currency: CurrencyCode;
  };
  recipient: any;
  sender: any;
  created_datetime: string;
}
```

## Best Practices

### 1. Always Use Unique References

```typescript
const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

### 2. Use Idempotency Keys

Prevent duplicate transfers by using idempotency keys:

```typescript
const idempotencyKey = `idem-${Date.now()}`;

const transfer = await flutterwave.api.transfers.directTransfer(
  transferData,
  traceId,
  idempotencyKey,
);
```

### 3. Handle Errors Gracefully

```typescript
try {
  const transfer = await flutterwave.api.transfers.directTransfer(data);
  console.log('Transfer successful:', transfer.id);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid transfer data:', error.message);
  } else {
    console.error('Transfer failed:', error);
  }
}
```

### 4. Check Transfer Status

Always verify the transfer status before considering it complete:

```typescript
const transfer = await flutterwave.api.transfers.retrieve(transferId);

if (transfer.status === 'SUCCESSFUL') {
  console.log('Transfer completed successfully');
} else if (transfer.status === 'FAILED') {
  console.log('Transfer failed, retry if needed');
}
```

## Related

- [Transfer Recipients API](/api/transfer-recipients)
- [Transfer Senders API](/api/transfer-senders)
- [Wallets API](/api/wallets)
