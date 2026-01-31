# Virtual Accounts

This guide provides comprehensive examples for creating and managing virtual accounts using the Flutterwave SDK. Virtual accounts allow your customers to make payments directly to dedicated bank accounts.

## Overview

Flutterwave offers two types of virtual accounts:

- **Static Virtual Accounts** - Permanent accounts tied to a customer for recurring payments
- **Dynamic Virtual Accounts** - Temporary accounts for one-time or limited-use payments

## Basic Virtual Account Creation

### Create a Static Virtual Account

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: 'sandbox',
});

const account = await flutterwave.api.virtualAccounts.create({
  type: 'static',
  reference: `va-${Date.now()}`,
  customer: {
    name: {
      first: 'John',
      last: 'Doe',
    },
    email: 'john.doe@example.com',
  },
  currency: 'NGN',
});

console.log('Account Number:', account.account_number);
console.log('Bank Name:', account.bank_name);
console.log('Account Name:', account.account_name);
console.log('Account ID:', account.id);
```

### Create a Dynamic Virtual Account

```typescript
const account = await flutterwave.api.virtualAccounts.create({
  type: 'dynamic',
  reference: `va-dynamic-${Date.now()}`,
  customer: {
    name: {
      first: 'Jane',
      last: 'Smith',
    },
    email: 'jane.smith@example.com',
  },
  currency: 'NGN',
  amount: 50000, // Expected payment amount
  expiry: 24, // Expires in 24 hours
});

console.log('Dynamic Account Created');
console.log('Account Number:', account.account_number);
console.log('Expected Amount:', account.amount);
console.log('Expires At:', account.expiry_date);
```

## Advanced Virtual Account Creation

### Create with Full Customer Details

```typescript
const account = await flutterwave.api.virtualAccounts.create({
  type: 'static',
  reference: `va-full-${Date.now()}`,
  customer: {
    name: {
      first: 'Michael',
      last: 'Johnson',
    },
    email: 'michael.johnson@example.com',
    phone_number: '+2348012345678',
  },
  currency: 'NGN',
  narration: 'Payment for services',
  bvn: '12345678901', // Bank Verification Number
  meta: {
    customer_id: 'CUST-12345',
    plan: 'premium',
  },
});

console.log('Account Created with Metadata');
console.log('Reference:', account.reference);
console.log('Metadata:', account.meta);
```

### Create with Customer ID

If you already have a customer in the system:

```typescript
// First, get the customer
const customers = await flutterwave.api.customers.list({
  page: 1,
  size: 10,
});

const customerId = customers.data[0].id;

// Create virtual account for existing customer
const account = await flutterwave.api.virtualAccounts.create({
  type: 'static',
  reference: `va-customer-${Date.now()}`,
  customer_id: customerId,
  currency: 'NGN',
});

console.log('Virtual Account for Customer:', customerId);
console.log('Account Number:', account.account_number);
```

## Managing Virtual Accounts

### List All Virtual Accounts

```typescript
const accounts = await flutterwave.api.virtualAccounts.list({
  page: 1,
  size: 20,
});

console.log(`Total Accounts: ${accounts.meta.total}`);
console.log(`Current Page: ${accounts.meta.current_page}`);

accounts.data.forEach((account) => {
  console.log(
    `${account.reference}: ${account.account_number} (${account.currency})`,
  );
});
```

### Retrieve a Specific Virtual Account

```typescript
const accountId = 'va_abc123';

const account = await flutterwave.api.virtualAccounts.retrieve(accountId);

console.log('Account Details:');
console.log('Number:', account.account_number);
console.log('Bank:', account.bank_name);
console.log('Status:', account.status);
console.log('Balance:', account.balance);
```

### Update Virtual Account

```typescript
const accountId = 'va_abc123';

const updated = await flutterwave.api.virtualAccounts.update(accountId, {
  action_type: 'update_bvn',
  bvn: '12345678901',
});

console.log('Account Updated');
console.log('ID:', updated.id);
console.log('Status:', updated.status);
```

## Webhook Integration

### Handle Virtual Account Credits

```typescript
import express from 'express';
import { WebhookValidator } from 'flutterwave-node-v4';

const app = express();
const validator = new WebhookValidator(process.env.SECRET_HASH!);

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['verif-hash'] as string;
  const rawBody = req.body.toString('utf8');

  if (!validator.validate(rawBody, signature)) {
    return res.sendStatus(401);
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'virtual_account.credited') {
    handleVirtualAccountCredit(event.data);
  }

  res.sendStatus(200);
});

async function handleVirtualAccountCredit(data: any): Promise<void> {
  console.log('Virtual Account Credited');
  console.log('Account Number:', data.account_number);
  console.log('Amount:', data.amount);
  console.log('Currency:', data.currency);
  console.log('Customer Email:', data.customer.email);
  console.log('Reference:', data.reference);

  // Credit customer's account in your database
  await creditCustomerAccount(data.customer.email, data.amount);

  // Send confirmation email
  await sendPaymentConfirmation(data.customer.email, data.amount);
}

async function creditCustomerAccount(
  email: string,
  amount: number,
): Promise<void> {
  // Your database logic here
  console.log(`Credited ${email} with ${amount}`);
}

async function sendPaymentConfirmation(
  email: string,
  amount: number,
): Promise<void> {
  // Your email logic here
  console.log(`Sent confirmation to ${email} for ${amount}`);
}

app.listen(3000);
```

## Use Cases

### Subscription Payments

Create virtual accounts for subscription customers:

```typescript
interface SubscriptionPlan {
  name: string;
  amount: number;
  interval: 'monthly' | 'yearly';
}

async function createSubscriptionAccount(
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  },
  plan: SubscriptionPlan,
) {
  const account = await flutterwave.api.virtualAccounts.create({
    type: 'static',
    reference: `sub-${customer.email}-${Date.now()}`,
    customer: {
      name: {
        first: customer.firstName,
        last: customer.lastName,
      },
      email: customer.email,
    },
    currency: 'NGN',
    narration: `${plan.name} subscription`,
    meta: {
      plan_name: plan.name,
      plan_amount: plan.amount,
      plan_interval: plan.interval,
    },
  });

  // Store account details in your database
  await saveSubscriptionAccount({
    customerId: customer.email,
    accountNumber: account.account_number,
    accountId: account.id,
    plan: plan.name,
  });

  return account;
}

// Usage
const account = await createSubscriptionAccount(
  {
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice@example.com',
  },
  {
    name: 'Premium Plan',
    amount: 5000,
    interval: 'monthly',
  },
);

console.log('Subscription Account:', account.account_number);
```

### Invoice Payments

Create dynamic virtual accounts for invoices:

```typescript
interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  dueDate: Date;
  items: Array<{ description: string; amount: number }>;
}

async function createInvoiceAccount(invoice: Invoice) {
  // Get customer details
  const customer = await getCustomerById(invoice.customerId);

  // Calculate hours until due date
  const hoursUntilDue = Math.ceil(
    (invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60),
  );

  const account = await flutterwave.api.virtualAccounts.create({
    type: 'dynamic',
    reference: `inv-${invoice.id}`,
    customer: {
      name: {
        first: customer.firstName,
        last: customer.lastName,
      },
      email: customer.email,
    },
    currency: 'NGN',
    amount: invoice.amount,
    expiry: hoursUntilDue,
    narration: `Payment for Invoice ${invoice.id}`,
    meta: {
      invoice_id: invoice.id,
      items: JSON.stringify(invoice.items),
    },
  });

  // Send invoice with account details to customer
  await sendInvoiceEmail(customer.email, invoice, account);

  return account;
}

async function getCustomerById(id: string): Promise<any> {
  // Your database logic
  return {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
  };
}

async function sendInvoiceEmail(
  email: string,
  invoice: Invoice,
  account: any,
): Promise<void> {
  console.log(`Invoice ${invoice.id} sent to ${email}`);
  console.log(`Pay to: ${account.account_number}`);
  console.log(`Amount: ${invoice.amount}`);
}
```

### Event Ticketing

Use virtual accounts for event ticket payments:

```typescript
interface Event {
  id: string;
  name: string;
  date: Date;
  ticketPrice: number;
  venue: string;
}

interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

async function createTicketAccount(event: Event, attendee: Attendee) {
  // Create account that expires 30 minutes before event
  const expiryDate = new Date(event.date);
  expiryDate.setMinutes(expiryDate.getMinutes() - 30);

  const hoursUntilExpiry = Math.ceil(
    (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60),
  );

  const account = await flutterwave.api.virtualAccounts.create({
    type: 'dynamic',
    reference: `ticket-${event.id}-${Date.now()}`,
    customer: {
      name: {
        first: attendee.firstName,
        last: attendee.lastName,
      },
      email: attendee.email,
      phone_number: attendee.phone,
    },
    currency: 'NGN',
    amount: event.ticketPrice,
    expiry: hoursUntilExpiry,
    narration: `Ticket for ${event.name}`,
    meta: {
      event_id: event.id,
      event_name: event.name,
      event_date: event.date.toISOString(),
      event_venue: event.venue,
    },
  });

  return {
    account,
    ticketId: `TCK-${Date.now()}`,
  };
}

// Usage
const ticketAccount = await createTicketAccount(
  {
    id: 'EVT-001',
    name: 'Tech Conference 2024',
    date: new Date('2024-06-15T09:00:00'),
    ticketPrice: 25000,
    venue: 'Lagos Convention Center',
  },
  {
    firstName: 'Carol',
    lastName: 'Brown',
    email: 'carol@example.com',
    phone: '+2348012345678',
  },
);

console.log('Ticket Account:', ticketAccount.account.account_number);
console.log('Ticket ID:', ticketAccount.ticketId);
```

## Account Monitoring

### Check Account Balance

```typescript
async function checkAccountBalance(accountId: string) {
  const account = await flutterwave.api.virtualAccounts.retrieve(accountId);

  console.log('Account Balance:', account.balance);
  console.log('Currency:', account.currency);
  console.log('Status:', account.status);

  return account.balance;
}
```

### Monitor Account Activity

```typescript
interface AccountActivity {
  accountId: string;
  lastChecked: Date;
  previousBalance: number;
  currentBalance: number;
  difference: number;
}

async function monitorAccount(accountId: string): Promise<AccountActivity> {
  // Get previous balance from your database
  const previousBalance = await getPreviousBalance(accountId);

  // Get current balance
  const account = await flutterwave.api.virtualAccounts.retrieve(accountId);
  const currentBalance = account.balance;

  const activity: AccountActivity = {
    accountId,
    lastChecked: new Date(),
    previousBalance,
    currentBalance,
    difference: currentBalance - previousBalance,
  };

  // Update balance in your database
  await updateStoredBalance(accountId, currentBalance);

  if (activity.difference > 0) {
    console.log(`Account ${accountId} received ${activity.difference}`);
    // Trigger notification
  }

  return activity;
}

async function getPreviousBalance(accountId: string): Promise<number> {
  // Your database logic
  return 0;
}

async function updateStoredBalance(
  accountId: string,
  balance: number,
): Promise<void> {
  // Your database logic
  console.log(`Updated balance for ${accountId}: ${balance}`);
}
```

## Error Handling

### Robust Account Creation

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
} from 'flutterwave-node-v4';

async function safeCreateVirtualAccount(accountData: any) {
  try {
    const account = await flutterwave.api.virtualAccounts.create(accountData);

    console.log('Virtual account created successfully');
    console.log('Account Number:', account.account_number);

    return {
      success: true,
      account,
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      console.error('Invalid account data:', error.message);
      return {
        success: false,
        error: 'Invalid account details',
        message: 'Please check the customer information and try again',
      };
    } else if (error instanceof UnauthorizedRequestException) {
      console.error('Authentication failed:', error.message);
      return {
        success: false,
        error: 'Authentication error',
        message: 'Please verify your credentials',
      };
    } else {
      console.error('Account creation failed:', error);
      return {
        success: false,
        error: 'Account creation failed',
        message: 'An unexpected error occurred',
      };
    }
  }
}

// Usage
const result = await safeCreateVirtualAccount({
  type: 'static',
  reference: `safe-va-${Date.now()}`,
  customer: {
    name: {
      first: 'Test',
      last: 'User',
    },
    email: 'test@example.com',
  },
  currency: 'NGN',
});

if (result.success) {
  console.log('Account created:', result.account.account_number);
} else {
  console.error('Failed:', result.message);
}
```

## Best Practices

### 1. Use Unique References

```typescript
function generateVirtualAccountReference(prefix: string = 'va'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}`;
}

const account = await flutterwave.api.virtualAccounts.create({
  reference: generateVirtualAccountReference('subscription'),
  // ... other fields
});
```

### 2. Store Account Details

```typescript
interface StoredAccount {
  accountId: string;
  accountNumber: string;
  bankName: string;
  customerId: string;
  reference: string;
  createdAt: Date;
  metadata: any;
}

async function createAndStoreVirtualAccount(
  accountData: any,
): Promise<StoredAccount> {
  const account = await flutterwave.api.virtualAccounts.create(accountData);

  const stored: StoredAccount = {
    accountId: account.id,
    accountNumber: account.account_number,
    bankName: account.bank_name,
    customerId: accountData.customer.email,
    reference: account.reference,
    createdAt: new Date(),
    metadata: account.meta,
  };

  // Save to database
  await saveAccountToDatabase(stored);

  return stored;
}

async function saveAccountToDatabase(account: StoredAccount): Promise<void> {
  // Your database logic
  console.log('Saved account:', account.accountNumber);
}
```

### 3. Implement Expiry Alerts

```typescript
async function createAccountWithExpiryAlert(accountData: any) {
  const account = await flutterwave.api.virtualAccounts.create(accountData);

  if (accountData.type === 'dynamic' && accountData.expiry) {
    // Schedule alert before expiry
    const alertTime = new Date();
    alertTime.setHours(alertTime.getHours() + accountData.expiry - 1);

    scheduleExpiryAlert(account.id, alertTime);
  }

  return account;
}

function scheduleExpiryAlert(accountId: string, alertTime: Date): void {
  const delay = alertTime.getTime() - Date.now();

  setTimeout(() => {
    console.log(`Alert: Account ${accountId} expires in 1 hour!`);
    // Send notification to customer
  }, delay);
}
```

### 4. Validate Customer Data

```typescript
function validateCustomerData(customer: any): void {
  if (!customer.name?.first || !customer.name?.last) {
    throw new Error('Customer name is required');
  }

  if (!customer.email) {
    throw new Error('Customer email is required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    throw new Error('Invalid email format');
  }
}

// Usage
try {
  validateCustomerData({
    name: { first: 'John', last: 'Doe' },
    email: 'john@example.com',
  });

  // Proceed with account creation
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Related

- [Virtual Accounts API](/api/virtual-accounts) - Complete API reference
- [Customers API](/api/customers) - Manage customers
- [Webhook Validation](/guide/webhooks) - Handle payment notifications
- [Error Handling](/guide/error-handling) - Handle errors gracefully
