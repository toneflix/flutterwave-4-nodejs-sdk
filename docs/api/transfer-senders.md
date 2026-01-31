# Transfer Senders API

The Transfer Senders API allows you to create and manage sender information for transfers. This is useful when you need to track or specify different senders for your transfers.

## Methods

### create()

Create a new transfer sender.

```typescript
async create(
  data: ITransferSenderCreateForm,
  traceId?: string
): Promise<ITransferSender>
```

#### Parameters

- `data` - Sender information
- `traceId` - Optional trace ID for request tracking

#### Example

```typescript
const sender = await flutterwave.api.transferSenders.create(
  {
    type: 'generic_sender',
    name: {
      first: 'Jane',
      last: 'Smith',
    },
    email: 'jane.smith@example.com',
  },
  'trace-id',
);

console.log('Sender ID:', sender.id);
console.log('Name:', `${sender.name.first} ${sender.name.last}`);
```

### list()

List all transfer senders with pagination.

```typescript
async list(
  query?: {
    page?: number;
    size?: number;
  },
  traceId?: string
): Promise<{
  data: ITransferSender[];
  cursor: PageCursor;
}>
```

#### Example

```typescript
const result = await flutterwave.api.transferSenders.list(
  {
    page: 1,
    size: 20,
  },
  'trace-id',
);

console.log(`Found ${result.data.length} senders`);
result.data.forEach((sender) => {
  console.log(`${sender.name.first} ${sender.name.last} - ${sender.email}`);
});
```

### retrieve()

Get details of a specific sender.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<ITransferSender>
```

#### Example

```typescript
const sender = await flutterwave.api.transferSenders.retrieve(
  'sender_id',
  'trace-id',
);

console.log('Sender:', sender.name);
console.log('Email:', sender.email);
```

### delete()

Delete a transfer sender.

```typescript
async delete(
  id: string,
  traceId?: string
): Promise<void>
```

#### Example

```typescript
await flutterwave.api.transferSenders.delete('sender_id', 'trace-id');

console.log('Sender deleted successfully');
```

## Type Definitions

### ITransferSenderCreateForm

```typescript
interface ITransferSenderCreateForm {
  type: 'generic_sender';
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone?: {
    country_code: string;
    number: string;
  };
}
```

### ITransferSender

```typescript
interface ITransferSender {
  id: string;
  type: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone?: {
    country_code: string;
    number: string;
  };
  created_datetime: string;
}
```

## Use Cases

### Create Sender for Department

```typescript
async function createDepartmentSender(department: string) {
  const sender = await flutterwave.api.transferSenders.create({
    type: 'generic_sender',
    name: {
      first: department,
      last: 'Department',
    },
    email: `${department.toLowerCase()}@company.com`,
  });

  return sender;
}
```

### Manage Multiple Senders

```typescript
async function setupCompanySenders() {
  const departments = ['Finance', 'HR', 'Operations'];
  const senders = [];

  for (const dept of departments) {
    const sender = await flutterwave.api.transferSenders.create({
      type: 'generic_sender',
      name: {
        first: dept,
        last: 'Team',
      },
      email: `${dept.toLowerCase()}@company.com`,
    });

    senders.push(sender);
  }

  return senders;
}
```

### Search Senders

```typescript
async function findSender(email: string) {
  const result = await flutterwave.api.transferSenders.list({
    page: 1,
    size: 100,
  });

  return result.data.find((sender) => sender.email === email);
}
```

## Best Practices

### 1. Create Senders for Different Use Cases

```typescript
// Payroll sender
const payrollSender = await flutterwave.api.transferSenders.create({
  type: 'generic_sender',
  name: { first: 'Payroll', last: 'System' },
  email: 'payroll@company.com',
});

// Vendor payment sender
const vendorSender = await flutterwave.api.transferSenders.create({
  type: 'generic_sender',
  name: { first: 'Accounts', last: 'Payable' },
  email: 'ap@company.com',
});
```

### 2. Store Sender IDs

```typescript
async function createAndStoreSender(senderData: any) {
  const sender = await flutterwave.api.transferSenders.create(senderData);

  // Store in your database
  await db.senders.create({
    flutterwave_sender_id: sender.id,
    department: senderData.department,
    email: sender.email,
  });

  return sender;
}
```

### 3. Validate Email Format

```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createSenderSafely(senderData: any) {
  if (!isValidEmail(senderData.email)) {
    throw new Error('Invalid email address');
  }

  return await flutterwave.api.transferSenders.create(senderData);
}
```

### 4. Clean Up Unused Senders

```typescript
async function removeUnusedSenders() {
  const result = await flutterwave.api.transferSenders.list({
    page: 1,
    size: 100,
  });

  // Logic to identify unused senders
  const unusedSenders = result.data.filter((sender) => {
    // Check your business logic here
    return false;
  });

  for (const sender of unusedSenders) {
    await flutterwave.api.transferSenders.delete(sender.id);
  }

  return unusedSenders.length;
}
```

## Error Handling

```typescript
try {
  const sender = await flutterwave.api.transferSenders.create({
    type: 'generic_sender',
    name: { first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
  });

  console.log('Sender created:', sender.id);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid sender data:', error.message);
  } else {
    console.error('Failed to create sender:', error);
  }
}
```

## Use in Transfers

When creating transfers, you can specify sender information inline or use a stored sender ID:

```typescript
// Using inline sender
const transfer = await flutterwave.api.transfers.directTransfer({
  // ... other fields
  payment_instruction: {
    // ... other fields
    sender: {
      name: { first: 'Jane', last: 'Doe' },
      email: 'jane@example.com',
    },
  },
});
```

## Related APIs

- [Transfers](/api/transfers) - Create transfers with sender information
- [Transfer Recipients](/api/transfer-recipients) - Manage transfer recipients
