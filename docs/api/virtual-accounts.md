# Virtual Accounts API

The Virtual Accounts API allows you to create and manage virtual bank accounts for receiving payments. Virtual accounts provide a unique account number for each customer to make payments directly to your business.

## Methods

### create()

Create a new virtual account.

```typescript
async create(
  data: IVirtualAccountCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<IVirtualAccount>
```

#### Parameters

- `data` - Virtual account information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicates

#### Example

```typescript
const virtualAccount = await flutterwave.api.virtualAccounts.create(
  {
    reference: `va-${Date.now()}`,
    customer_id: 'customer_id_here',
    amount: 5000,
    currency: 'NGN',
    account_type: 'static',
  },
  'trace-id',
  'idem-key',
);

console.log('Account Number:', virtualAccount.account_number);
console.log('Bank Name:', virtualAccount.bank_name);
console.log('Account Name:', virtualAccount.account_name);
```

### list()

List all virtual accounts with pagination.

```typescript
async list(query?: {
  page?: number;
  size?: number;
}): Promise<{
  data: IVirtualAccount[];
  meta: PageMeta;
}>
```

#### Example

```typescript
const result = await flutterwave.api.virtualAccounts.list({
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} virtual accounts`);
result.data.forEach((account) => {
  console.log(`${account.account_number} - ${account.account_name}`);
});
```

### retrieve()

Get details of a specific virtual account.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<IVirtualAccount>
```

#### Example

```typescript
const account = await flutterwave.api.virtualAccounts.retrieve(
  'account_id',
  'trace-id',
);

console.log('Account Number:', account.account_number);
console.log('Status:', account.status);
```

### update()

Update a virtual account.

```typescript
async update(
  id: string,
  data: IVirtualAccountUpdateForm,
  traceId?: string
): Promise<IVirtualAccount>
```

#### Example

```typescript
const updated = await flutterwave.api.virtualAccounts.update(
  'account_id',
  {
    status: 'active',
    amount: 10000,
  },
  'trace-id',
);

console.log('Updated account:', updated.id);
```

## Type Definitions

### IVirtualAccountCreateForm

```typescript
interface IVirtualAccountCreateForm {
  reference: string;
  customer_id: string;
  amount: number;
  currency: string;
  account_type: 'static' | 'dynamic';
  meta?: Record<string, any>;
}
```

### IVirtualAccountUpdateForm

```typescript
interface IVirtualAccountUpdateForm {
  status?: 'active' | 'inactive';
  amount?: number;
  meta?: Record<string, any>;
}
```

### IVirtualAccount

```typescript
interface IVirtualAccount {
  id: string;
  reference: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: 'active' | 'inactive';
  account_type: 'static' | 'dynamic';
  created_datetime: string;
  updated_datetime: string;
}
```

## Use Cases

### Create Virtual Account for Customer

```typescript
async function createCustomerVirtualAccount(
  customerId: string,
  customerName: string,
) {
  const account = await flutterwave.api.virtualAccounts.create({
    reference: `va-${customerId}-${Date.now()}`,
    customer_id: customerId,
    amount: 0, // For unlimited collections
    currency: 'NGN',
    account_type: 'static',
    meta: {
      customer_name: customerName,
      created_at: new Date().toISOString(),
    },
  });

  return {
    accountNumber: account.account_number,
    bankName: account.bank_name,
    accountName: account.account_name,
  };
}
```

### Create Fixed-Amount Virtual Account

```typescript
async function createInvoiceVirtualAccount(invoiceId: string, amount: number) {
  const account = await flutterwave.api.virtualAccounts.create({
    reference: `invoice-${invoiceId}`,
    customer_id: 'customer_id',
    amount,
    currency: 'NGN',
    account_type: 'dynamic',
    meta: {
      invoice_id: invoiceId,
      invoice_amount: amount,
    },
  });

  return account;
}
```

### List Active Virtual Accounts

```typescript
async function getActiveAccounts() {
  const result = await flutterwave.api.virtualAccounts.list({
    page: 1,
    size: 100,
  });

  const active = result.data.filter((account) => account.status === 'active');

  return active;
}
```

### Deactivate Virtual Account

```typescript
async function deactivateAccount(accountId: string) {
  const updated = await flutterwave.api.virtualAccounts.update(accountId, {
    status: 'inactive',
  });

  console.log(`Account ${accountId} deactivated`);
  return updated;
}
```

## Best Practices

### 1. Use Unique References

```typescript
const reference = `va-${customerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const account = await flutterwave.api.virtualAccounts.create({
  reference,
  customer_id: customerId,
  amount: 0,
  currency: 'NGN',
  account_type: 'static',
});
```

### 2. Store Virtual Account Details

```typescript
async function createAndStoreVirtualAccount(customerId: string) {
  const account = await flutterwave.api.virtualAccounts.create({
    reference: `va-${customerId}`,
    customer_id: customerId,
    amount: 0,
    currency: 'NGN',
    account_type: 'static',
  });

  // Store in your database
  await db.virtualAccounts.create({
    flutterwave_account_id: account.id,
    customer_id: customerId,
    account_number: account.account_number,
    bank_name: account.bank_name,
  });

  return account;
}
```

### 3. Set Up Webhooks

Configure webhooks to receive notifications when payments are made to virtual accounts:

```typescript
// In your webhook handler
app.post('/webhook', (req, res) => {
  const event = req.body;

  if (event.event === 'virtual_account.credited') {
    const accountNumber = event.data.account_number;
    const amount = event.data.amount;

    console.log(`Account ${accountNumber} received ${amount}`);

    // Process the payment
    processVirtualAccountPayment(event.data);
  }

  res.sendStatus(200);
});
```

### 4. Implement Idempotency

```typescript
const idempotencyKey = `va-${customerId}-${invoiceId}`;

const account = await flutterwave.api.virtualAccounts.create(
  {
    reference: `invoice-${invoiceId}`,
    customer_id: customerId,
    amount: invoiceAmount,
    currency: 'NGN',
    account_type: 'dynamic',
  },
  traceId,
  idempotencyKey,
);
```

## Virtual Account Types

### Static Accounts

- Permanent account numbers
- Can receive multiple payments
- Ideal for recurring collections
- Set `account_type: 'static'`

```typescript
const staticAccount = await flutterwave.api.virtualAccounts.create({
  reference: `static-${customerId}`,
  customer_id: customerId,
  amount: 0,
  currency: 'NGN',
  account_type: 'static',
});
```

### Dynamic Accounts

- One-time use or limited-use accounts
- Automatically deactivated after target amount is reached
- Ideal for specific invoices or payments
- Set `account_type: 'dynamic'`

```typescript
const dynamicAccount = await flutterwave.api.virtualAccounts.create({
  reference: `invoice-${invoiceId}`,
  customer_id: customerId,
  amount: 50000, // Deactivates after receiving this amount
  currency: 'NGN',
  account_type: 'dynamic',
});
```

## Error Handling

```typescript
try {
  const account = await flutterwave.api.virtualAccounts.create({
    reference: `va-${Date.now()}`,
    customer_id: 'customer_id',
    amount: 5000,
    currency: 'NGN',
    account_type: 'static',
  });

  console.log('Virtual account created:', account.account_number);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid account data:', error.message);
  } else {
    console.error('Failed to create virtual account:', error);
  }
}
```

## Use Cases by Industry

### E-commerce

Create unique accounts for each customer order:

```typescript
const orderAccount = await flutterwave.api.virtualAccounts.create({
  reference: `order-${orderId}`,
  customer_id: customerId,
  amount: orderTotal,
  currency: 'NGN',
  account_type: 'dynamic',
});
```

### Subscription Services

Create static accounts for subscription payments:

```typescript
const subscriptionAccount = await flutterwave.api.virtualAccounts.create({
  reference: `sub-${userId}`,
  customer_id: userId,
  amount: 0,
  currency: 'NGN',
  account_type: 'static',
  meta: {
    subscription_plan: 'premium',
  },
});
```

### Invoice Payments

Generate account for each invoice:

```typescript
const invoiceAccount = await flutterwave.api.virtualAccounts.create({
  reference: `inv-${invoiceNumber}`,
  customer_id: customerId,
  amount: invoiceAmount,
  currency: 'NGN',
  account_type: 'dynamic',
  meta: {
    invoice_number: invoiceNumber,
    due_date: dueDate,
  },
});
```

## Related APIs

- [Customers](/api/customers) - Create customers for virtual accounts
- [Wallets](/api/wallets) - Check received payments
