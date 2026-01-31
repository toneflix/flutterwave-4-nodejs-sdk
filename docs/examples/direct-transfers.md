# Direct Transfers

This guide provides comprehensive examples for sending money using Flutterwave's direct transfer API. Direct transfers allow you to send funds instantly to bank accounts, wallets, and mobile money accounts.

## Overview

Direct transfers support three types:

- **Bank transfers** - Send to bank accounts
- **Wallet transfers** - Send to Flutterwave wallets
- **Mobile money transfers** - Send to mobile money accounts

## Basic Bank Transfer

### Simple Bank Transfer

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: 'sandbox',
});

const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  type: 'bank',
  reference: `transfer-${Date.now()}`,
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
console.log('Transfer Status:', transfer.status);
console.log('Reference:', transfer.reference);
```

### Transfer with Narration

Add a description to the transfer:

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  type: 'bank',
  reference: `transfer-${Date.now()}`,
  narration: 'Payment for services rendered',
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 50000,
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
        first: 'Jane',
        last: 'Smith',
      },
    },
  },
});
```

### Transfer with Trace ID

Use a trace ID for tracking and debugging:

```typescript
const traceId = `trace-${Date.now()}`;

const transfer = await flutterwave.api.transfers.directTransfer(
  {
    action: 'instant',
    type: 'bank',
    reference: `transfer-${Date.now()}`,
    payment_instruction: {
      source_currency: 'NGN',
      destination_currency: 'NGN',
      amount: {
        value: 25000,
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
          first: 'Michael',
          last: 'Johnson',
        },
      },
    },
  },
  traceId,
);

console.log('Trace ID:', traceId);
console.log('Transfer ID:', transfer.id);
```

## Wallet Transfers

### Transfer to Flutterwave Wallet

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  type: 'wallet',
  reference: `wallet-transfer-${Date.now()}`,
  narration: 'Wallet credit',
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 5000,
      applies_to: 'source_currency',
    },
    recipient: {
      wallet: {
        identifier: '0690000031',
        provider: 'flutterwave',
      },
    },
    sender: {
      name: {
        first: 'Sarah',
        last: 'Williams',
      },
    },
  },
});

console.log('Wallet Transfer ID:', transfer.id);
console.log('Status:', transfer.status);
```

## Scheduled Transfers

### Schedule a Future Transfer

```typescript
const scheduledDate = new Date();
scheduledDate.setDate(scheduledDate.getDate() + 7); // 7 days from now

const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'scheduled',
  type: 'bank',
  reference: `scheduled-${Date.now()}`,
  scheduled_date: scheduledDate.toISOString(),
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 100000,
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
        first: 'David',
        last: 'Brown',
      },
    },
  },
});

console.log('Scheduled Transfer ID:', transfer.id);
console.log('Scheduled for:', scheduledDate.toISOString());
```

## Cross-Currency Transfers

### Transfer with Currency Conversion

```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
  action: 'instant',
  type: 'bank',
  reference: `cross-currency-${Date.now()}`,
  payment_instruction: {
    source_currency: 'USD',
    destination_currency: 'NGN',
    amount: {
      value: 100, // $100 USD
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
        first: 'Emma',
        last: 'Davis',
      },
    },
  },
});

console.log('Source Amount:', transfer.payment_instruction.amount.value, 'USD');
console.log('Destination Amount (NGN):', transfer.destination_amount);
```

## Bulk Transfers

### Process Multiple Transfers

```typescript
interface TransferRecipient {
  accountNumber: string;
  bankCode: string;
  amount: number;
  name: {
    first: string;
    last: string;
  };
}

async function processBulkTransfers(recipients: TransferRecipient[]) {
  const results = [];

  for (const recipient of recipients) {
    try {
      const transfer = await flutterwave.api.transfers.directTransfer({
        action: 'instant',
        type: 'bank',
        reference: `bulk-${Date.now()}-${recipient.accountNumber}`,
        payment_instruction: {
          source_currency: 'NGN',
          destination_currency: 'NGN',
          amount: {
            value: recipient.amount,
            applies_to: 'source_currency',
          },
          recipient: {
            bank: {
              account_number: recipient.accountNumber,
              code: recipient.bankCode,
            },
          },
          sender: {
            name: recipient.name,
          },
        },
      });

      results.push({
        success: true,
        transferId: transfer.id,
        reference: transfer.reference,
        recipient: recipient.accountNumber,
      });
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        recipient: recipient.accountNumber,
      });
    }
  }

  return results;
}

// Usage
const recipients: TransferRecipient[] = [
  {
    accountNumber: '0690000031',
    bankCode: '044',
    amount: 5000,
    name: { first: 'Alice', last: 'Johnson' },
  },
  {
    accountNumber: '0690000032',
    bankCode: '044',
    amount: 7500,
    name: { first: 'Bob', last: 'Smith' },
  },
  {
    accountNumber: '0690000033',
    bankCode: '044',
    amount: 10000,
    name: { first: 'Carol', last: 'Williams' },
  },
];

const results = await processBulkTransfers(recipients);
console.log('Bulk transfer results:', results);
```

## Account Verification

### Verify Account Before Transfer

```typescript
async function verifyAndTransfer(
  accountNumber: string,
  bankCode: string,
  amount: number,
) {
  // First, verify the account
  const verification = await flutterwave.api.banks.resolve({
    account: {
      number: accountNumber,
      code: bankCode,
    },
    currency: 'NGN',
  });

  console.log('Account Name:', verification.name);
  console.log('Account Number:', verification.number);

  // Confirm with user (in a real app)
  const confirmed = true; // User confirms the name

  if (!confirmed) {
    throw new Error('Transfer cancelled by user');
  }

  // Proceed with transfer
  const transfer = await flutterwave.api.transfers.directTransfer({
    action: 'instant',
    type: 'bank',
    reference: `verified-${Date.now()}`,
    payment_instruction: {
      source_currency: 'NGN',
      destination_currency: 'NGN',
      amount: {
        value: amount,
        applies_to: 'source_currency',
      },
      recipient: {
        bank: {
          account_number: accountNumber,
          code: bankCode,
        },
      },
      sender: {
        name: {
          first: 'Verified',
          last: 'Sender',
        },
      },
    },
  });

  return {
    verification,
    transfer,
  };
}

// Usage
const result = await verifyAndTransfer('0690000031', '044', 15000);
console.log('Verified account:', result.verification.name);
console.log('Transfer ID:', result.transfer.id);
```

## Idempotency

### Prevent Duplicate Transfers

```typescript
import { v4 as uuidv4 } from 'uuid';

const idempotencyKey = uuidv4();

const transfer = await flutterwave.api.transfers.directTransfer(
  {
    action: 'instant',
    type: 'bank',
    reference: `idempotent-${Date.now()}`,
    payment_instruction: {
      source_currency: 'NGN',
      destination_currency: 'NGN',
      amount: {
        value: 20000,
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
          first: 'Test',
          last: 'User',
        },
      },
    },
  },
  undefined, // traceId
  idempotencyKey,
);

// If you retry with the same idempotency key, you'll get the same transfer
```

## Error Handling

### Robust Transfer with Error Handling

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
} from 'flutterwave-node-v4';

async function safeTransfer(transferData: any) {
  try {
    const transfer =
      await flutterwave.api.transfers.directTransfer(transferData);

    console.log('Transfer successful!');
    console.log('Transfer ID:', transfer.id);
    console.log('Reference:', transfer.reference);
    console.log('Status:', transfer.status);

    return {
      success: true,
      data: transfer,
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      console.error('Invalid transfer data:', error.message);
      return {
        success: false,
        error: 'Invalid transfer details',
        message: 'Please check your transfer information and try again',
      };
    } else if (error instanceof UnauthorizedRequestException) {
      console.error('Authentication failed:', error.message);
      return {
        success: false,
        error: 'Authentication error',
        message: 'Please check your credentials',
      };
    } else {
      console.error('Transfer failed:', error);
      return {
        success: false,
        error: 'Transfer failed',
        message: 'An unexpected error occurred',
      };
    }
  }
}

// Usage
const result = await safeTransfer({
  action: 'instant',
  type: 'bank',
  reference: `safe-${Date.now()}`,
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 12000,
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
        first: 'Safe',
        last: 'Transfer',
      },
    },
  },
});

if (result.success) {
  console.log('Transfer completed:', result.data.id);
} else {
  console.error('Transfer failed:', result.message);
}
```

## Transfer Status Tracking

### Check Transfer Status

```typescript
async function trackTransfer(transferId: string) {
  const transfer = await flutterwave.api.transfers.retrieve(transferId);

  console.log('Transfer Status:', transfer.status);
  console.log('Reference:', transfer.reference);
  console.log('Amount:', transfer.payment_instruction.amount.value);

  return transfer;
}

// Usage
const transferId = 'txf_abc123';
const status = await trackTransfer(transferId);
```

### List Recent Transfers

```typescript
async function getRecentTransfers(limit: number = 10) {
  const transfers = await flutterwave.api.transfers.list({
    page: 1,
    size: limit,
  });

  console.log(`Found ${transfers.data.length} transfers`);

  transfers.data.forEach((transfer) => {
    console.log(
      `${transfer.reference}: ${transfer.status} - ${transfer.payment_instruction.amount.value}`,
    );
  });

  return transfers;
}

// Usage
await getRecentTransfers(20);
```

## Best Practices

### 1. Always Generate Unique References

```typescript
function generateTransferReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `transfer-${timestamp}-${random}`;
}

const transfer = await flutterwave.api.transfers.directTransfer({
  reference: generateTransferReference(),
  // ... other fields
});
```

### 2. Validate Amount Before Transfer

```typescript
function validateTransferAmount(amount: number): void {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  if (amount > 1000000) {
    throw new Error('Amount exceeds maximum limit');
  }

  // Check for decimal places (max 2)
  if (amount.toString().includes('.')) {
    const decimals = amount.toString().split('.')[1];
    if (decimals.length > 2) {
      throw new Error('Amount can have at most 2 decimal places');
    }
  }
}

// Usage
try {
  validateTransferAmount(15000.5);
  // Proceed with transfer
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### 3. Log All Transfers

```typescript
interface TransferLog {
  timestamp: string;
  reference: string;
  amount: number;
  currency: string;
  recipient: string;
  status: string;
  transferId?: string;
  error?: string;
}

const transferLogs: TransferLog[] = [];

async function loggedTransfer(transferData: any) {
  const log: TransferLog = {
    timestamp: new Date().toISOString(),
    reference: transferData.reference,
    amount: transferData.payment_instruction.amount.value,
    currency: transferData.payment_instruction.source_currency,
    recipient:
      transferData.payment_instruction.recipient.bank?.account_number ||
      'unknown',
    status: 'pending',
  };

  try {
    const transfer =
      await flutterwave.api.transfers.directTransfer(transferData);

    log.status = 'success';
    log.transferId = transfer.id;

    return transfer;
  } catch (error) {
    log.status = 'failed';
    log.error = error instanceof Error ? error.message : 'Unknown error';

    throw error;
  } finally {
    transferLogs.push(log);
  }
}
```

### 4. Implement Retry Logic

```typescript
async function transferWithRetry(
  transferData: any,
  maxRetries: number = 3,
): Promise<any> {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const transfer =
        await flutterwave.api.transfers.directTransfer(transferData);
      console.log(`Transfer successful on attempt ${attempt}`);
      return transfer;
    } catch (error) {
      lastError = error;
      console.error(`Transfer attempt ${attempt} failed:`, error);

      if (error instanceof BadRequestException) {
        // Don't retry bad requests
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

## Related

- [Transfers API](/api/transfers) - Complete API reference
- [Banks API](/api/banks) - Account verification
- [Transfer Recipients](/api/transfer-recipients) - Manage recipients
- [Error Handling](/guide/error-handling) - Handle transfer errors
