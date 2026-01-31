# Customers API

The Customers API allows you to create and manage customer records in your Flutterwave account.

## Methods

### create()

Create a new customer record.

```typescript
async create(
  data: ICustomerCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<ICustomer>
```

#### Parameters

- `data` - Customer information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicate customer creation

#### Example

```typescript
const customer = await flutterwave.api.customers.create(
  {
    email: 'customer@example.com',
    name: {
      first: 'John',
      last: 'Doe',
    },
    phone: {
      country_code: '234',
      number: '8012345678',
    },
    address: {
      line1: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      country: 'NG',
      postal_code: '100001',
    },
    meta: {
      internal_id: 'USER_12345',
      tier: 'premium',
    },
  },
  'trace-id',
  'idem-key',
);

console.log('Customer ID:', customer.id);
console.log('Email:', customer.email);
```

### list()

List all customers with optional filters and pagination.

```typescript
async list(query?: {
  page?: number;
  size?: number;
}): Promise<{
  data: ICustomer[];
  meta: PageMeta;
}>
```

#### Parameters

- `query.page` - Page number (default: 1)
- `query.size` - Number of items per page (default: 10)

#### Example

```typescript
const result = await flutterwave.api.customers.list({
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} customers`);
result.data.forEach((customer) => {
  console.log(
    `${customer.name.first} ${customer.name.last} - ${customer.email}`,
  );
});

console.log('Total:', result.meta.total);
console.log('Current page:', result.meta.page);
```

## Type Definitions

### ICustomerCreateForm

```typescript
interface ICustomerCreateForm {
  email: string;
  name: {
    first: string;
    last: string;
  };
  phone?: {
    country_code: string;
    number: string;
  };
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  meta?: Record<string, any>;
}
```

### ICustomer

```typescript
interface ICustomer {
  id: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
  phone?: {
    country_code: string;
    number: string;
  };
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  meta?: Record<string, any>;
  created_datetime: string;
  updated_datetime: string;
}
```

## Use Cases

### Creating Customers for Recurring Payments

```typescript
async function setupRecurringCustomer(userEmail: string) {
  const customer = await flutterwave.api.customers.create({
    email: userEmail,
    name: {
      first: 'Jane',
      last: 'Smith',
    },
    meta: {
      subscription_plan: 'monthly',
      created_from: 'web_app',
    },
  });

  // Store customer.id in your database for future charges
  return customer.id;
}
```

### Listing Recent Customers

```typescript
async function getRecentCustomers() {
  const result = await flutterwave.api.customers.list({
    page: 1,
    size: 10,
  });

  return result.data;
}
```

### Creating Customer with Full Details

```typescript
const customer = await flutterwave.api.customers.create({
  email: 'premium.user@example.com',
  name: {
    first: 'Michael',
    last: 'Johnson',
  },
  phone: {
    country_code: '234',
    number: '8098765432',
  },
  address: {
    line1: '456 Corporate Blvd',
    line2: 'Suite 200',
    city: 'Abuja',
    state: 'FCT',
    country: 'NG',
    postal_code: '900001',
  },
  meta: {
    company: 'Tech Corp',
    department: 'Engineering',
    employee_id: 'EMP-001',
  },
});
```

## Best Practices

### 1. Use Idempotency Keys

Prevent duplicate customer creation during network retries:

```typescript
const idempotencyKey = `customer-${userEmail}-${Date.now()}`;

const customer = await flutterwave.api.customers.create(
  customerData,
  traceId,
  idempotencyKey,
);
```

### 2. Store Metadata

Use the `meta` field to store additional information:

```typescript
const customer = await flutterwave.api.customers.create({
  email: 'user@example.com',
  name: { first: 'John', last: 'Doe' },
  meta: {
    user_id: 'internal-user-123',
    account_type: 'premium',
    referral_code: 'REF123',
    registration_date: new Date().toISOString(),
  },
});
```

### 3. Validate Email Before Creation

```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createCustomerSafely(
  email: string,
  name: { first: string; last: string },
) {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address');
  }

  return await flutterwave.api.customers.create({
    email,
    name,
  });
}
```

### 4. Handle Duplicate Customers

```typescript
async function getOrCreateCustomer(
  email: string,
  name: { first: string; last: string },
) {
  try {
    // Try to create customer
    return await flutterwave.api.customers.create({ email, name });
  } catch (error) {
    if (error.message.includes('already exists')) {
      // Fetch existing customer from your database
      return await fetchExistingCustomer(email);
    }
    throw error;
  }
}
```

## Error Handling

```typescript
try {
  const customer = await flutterwave.api.customers.create({
    email: 'test@example.com',
    name: { first: 'Test', last: 'User' },
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid customer data:', error.message);
  } else {
    console.error('Failed to create customer:', error);
  }
}
```

## Related APIs

- [Payment Methods](/api/payment-methods) - Store payment methods for customers
- [Orders](/api/orders) - Create orders for customers
- [Charges](/api/charges) - Charge customer payment methods
