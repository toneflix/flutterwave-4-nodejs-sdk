# Transfer Recipients API

The Transfer Recipients API allows you to create and manage beneficiaries for transfers. Storing recipients makes it easier to send repeat transfers.

## Methods

### create()

Create a new transfer recipient.

```typescript
async create(
  data: ITransferRecipientCreateForm,
  traceId?: string
): Promise<ITransferRecipient>
```

#### Parameters

- `data` - Recipient information
- `traceId` - Optional trace ID for request tracking

#### Example: Bank Recipient (NGN)

```typescript
const recipient = await flutterwave.api.transferRecipients.create(
  {
    type: 'bank_ngn',
    name: {
      first: 'John',
      last: 'Doe',
    },
    bank: {
      code: '044',
      account_number: '0690000031',
    },
  },
  'trace-id',
);

console.log('Recipient ID:', recipient.id);
console.log('Name:', `${recipient.name.first} ${recipient.name.last}`);
console.log('Currency:', recipient.currency);
```

### list()

List all transfer recipients with pagination.

```typescript
async list(
  query?: {
    page?: number;
    size?: number;
  },
  traceId?: string
): Promise<{
  data: ITransferRecipient[];
  cursor: PageCursor;
}>
```

#### Example

```typescript
const result = await flutterwave.api.transferRecipients.list(
  {
    page: 1,
    size: 20,
  },
  'trace-id',
);

console.log(`Found ${result.data.length} recipients`);
result.data.forEach((recipient) => {
  console.log(
    `${recipient.name.first} ${recipient.name.last} - ${recipient.currency}`,
  );
});
```

### retrieve()

Get details of a specific recipient.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<ITransferRecipient>
```

#### Example

```typescript
const recipient = await flutterwave.api.transferRecipients.retrieve(
  'recipient_id',
  'trace-id',
);

console.log('Recipient:', recipient.name);
```

### delete()

Delete a transfer recipient.

```typescript
async delete(
  id: string,
  traceId?: string
): Promise<void>
```

#### Example

```typescript
await flutterwave.api.transferRecipients.delete('recipient_id', 'trace-id');

console.log('Recipient deleted successfully');
```

## Type Definitions

### ITransferRecipientCreateForm

The form structure varies by recipient type:

```typescript
type ITransferRecipientCreateForm =
  | {
      type: 'bank_ngn';
      name: { first: string; last: string };
      bank: { code: string; account_number: string };
    }
  | {
      type: 'bank_usd';
      name: { first: string; last: string };
      bank: {
        code: string;
        account_number: string;
        country: string;
      };
    }
  | {
      type: 'mobile_money_kes';
      name: { first: string; last: string };
      mobile_money: { network: string; msisdn: string };
    };
// ... other types
```

### ITransferRecipient

```typescript
interface ITransferRecipient {
  id: string;
  name: {
    first: string;
    last: string;
  };
  currency: string;
  created_datetime: string;
  // Additional fields based on type
}
```

## Use Cases

### Create Bank Recipient

```typescript
async function createBankRecipient(
  firstName: string,
  lastName: string,
  bankCode: string,
  accountNumber: string,
) {
  const recipient = await flutterwave.api.transferRecipients.create({
    type: 'bank_ngn',
    name: {
      first: firstName,
      last: lastName,
    },
    bank: {
      code: bankCode,
      account_number: accountNumber,
    },
  });

  return recipient.id;
}
```

### Create and Store Multiple Recipients

```typescript
async function importRecipients(recipientList: any[]) {
  const created = [];

  for (const recipientData of recipientList) {
    const recipient = await flutterwave.api.transferRecipients.create({
      type: 'bank_ngn',
      name: recipientData.name,
      bank: recipientData.bank,
    });

    created.push(recipient);
  }

  return created;
}
```

### Search Recipients

```typescript
async function findRecipient(searchTerm: string) {
  const result = await flutterwave.api.transferRecipients.list({
    page: 1,
    size: 100,
  });

  return result.data.filter((recipient) => {
    const fullName =
      `${recipient.name.first} ${recipient.name.last}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
}
```

### Remove Inactive Recipients

```typescript
async function cleanupRecipients() {
  const result = await flutterwave.api.transferRecipients.list({
    page: 1,
    size: 100,
  });

  // Logic to determine inactive recipients
  const inactiveRecipients = result.data.filter((recipient) => {
    // Your business logic here
    return false;
  });

  for (const recipient of inactiveRecipients) {
    await flutterwave.api.transferRecipients.delete(recipient.id);
  }

  return inactiveRecipients.length;
}
```

## Best Practices

### 1. Validate Before Creating

```typescript
async function validateAndCreateRecipient(recipientData: any) {
  // Validate account details first
  const validAccount = await flutterwave.api.banks.resolve({
    account: {
      code: recipientData.bankCode,
      number: recipientData.accountNumber,
    },
    currency: 'NGN',
  });

  console.log(`Creating recipient: ${validAccount.account_name}`);

  // Create recipient
  const recipient = await flutterwave.api.transferRecipients.create({
    type: 'bank_ngn',
    name: recipientData.name,
    bank: {
      code: recipientData.bankCode,
      account_number: recipientData.accountNumber,
    },
  });

  return recipient;
}
```

### 2. Check for Duplicates

```typescript
async function createUniqueRecipient(
  accountNumber: string,
  bankCode: string,
  name: any,
) {
  const existing = await flutterwave.api.transferRecipients.list({
    page: 1,
    size: 100,
  });

  const duplicate = existing.data.find((r) => {
    if (r.type === 'bank') {
      return (
        r.bank?.account_number === accountNumber && r.bank?.code === bankCode
      );
    }
    return false;
  });

  if (duplicate) {
    console.log('Recipient already exists:', duplicate.id);
    return duplicate;
  }

  return await flutterwave.api.transferRecipients.create({
    type: 'bank_ngn',
    name,
    bank: { code: bankCode, account_number: accountNumber },
  });
}
```

### 3. Store Recipient IDs

```typescript
async function createAndStoreRecipient(recipientData: any) {
  const recipient = await flutterwave.api.transferRecipients.create({
    type: 'bank_ngn',
    name: recipientData.name,
    bank: recipientData.bank,
  });

  // Store in your database
  await db.recipients.create({
    flutterwave_recipient_id: recipient.id,
    user_id: recipientData.userId,
    account_number: recipientData.bank.account_number,
    bank_code: recipientData.bank.code,
  });

  return recipient;
}
```

## Error Handling

```typescript
try {
  const recipient = await flutterwave.api.transferRecipients.create({
    type: 'bank_ngn',
    name: { first: 'John', last: 'Doe' },
    bank: { code: '044', account_number: '0690000031' },
  });

  console.log('Recipient created:', recipient.id);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid recipient data:', error.message);
  } else {
    console.error('Failed to create recipient:', error);
  }
}
```

## Recipient Types

The API supports various recipient types:

- `bank_ngn` - Nigerian bank accounts
- `bank_usd` - USD bank accounts
- `bank_gbp` - GBP bank accounts
- `bank_eur` - EUR bank accounts
- `mobile_money_*` - Mobile money accounts (KES, GHS, UGX, etc.)
- `wallet_*` - Digital wallet accounts

Each type has specific required fields based on the currency and payment method.

## Related APIs

- [Banks](/api/banks) - Validate account details before creating recipients
- [Transfers](/api/transfers) - Send money to recipients
- [Transfer Senders](/api/transfer-senders) - Manage sender information
