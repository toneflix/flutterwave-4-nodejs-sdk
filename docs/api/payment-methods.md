# Payment Methods API

The Payment Methods API allows you to securely store and manage customer payment methods (cards, bank accounts, etc.) for future charges.

## Methods

### create()

Store a new payment method for a customer.

```typescript
async create(
  data: IPaymentMethodCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<IPaymentMethod>
```

#### Parameters

- `data` - Payment method information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicates

#### Example: Store Card

```typescript
const paymentMethod = await flutterwave.api.paymentMethods.create(
  {
    type: 'card',
    card: {
      card_number: '4242424242424242',
      cvv: '123',
      expiry_month: '12',
      expiry_year: '30',
      billing_address: {
        line1: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        country: 'NG',
        postal_code: '100001',
      },
    },
    customer_id: 'customer_id_here',
  },
  'trace-id',
  'idem-key',
);

console.log('Payment Method ID:', paymentMethod.id);
console.log('Type:', paymentMethod.type);
```

### list()

List all stored payment methods with pagination.

```typescript
async list(query?: {
  page?: number;
  size?: number;
}): Promise<{
  data: IPaymentMethod[];
  meta: PageMeta;
}>
```

#### Parameters

- `query.page` - Page number (default: 1)
- `query.size` - Number of items per page (default: 10)

#### Example

```typescript
const result = await flutterwave.api.paymentMethods.list({
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} payment methods`);
result.data.forEach((pm) => {
  console.log(`${pm.type} - ${pm.id}`);
});
```

## Type Definitions

### IPaymentMethodCreateForm

```typescript
interface IPaymentMethodCreateForm {
  type: 'card';
  customer_id: string;
  card: {
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    billing_address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
}
```

### IPaymentMethod

```typescript
interface IPaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  customer_id: string;
  created_datetime: string;
  // Additional fields based on type
}
```

## Use Cases

### Save Card for Recurring Payments

```typescript
async function setupRecurringPayment(customerId: string, cardDetails: any) {
  // Store the payment method
  const paymentMethod = await flutterwave.api.paymentMethods.create({
    type: 'card',
    customer_id: customerId,
    card: {
      card_number: cardDetails.number,
      cvv: cardDetails.cvv,
      expiry_month: cardDetails.expiry_month,
      expiry_year: cardDetails.expiry_year,
      billing_address: cardDetails.billing_address,
    },
  });

  // Use this payment method ID for future charges
  return paymentMethod.id;
}
```

### List Customer Payment Methods

```typescript
async function getCustomerPaymentMethods(page: number = 1) {
  const result = await flutterwave.api.paymentMethods.list({
    page,
    size: 10,
  });

  return result.data;
}
```

## Best Practices

### 1. Use Idempotency Keys

Prevent duplicate payment method storage:

```typescript
const idempotencyKey = `pm-${customerId}-${Date.now()}`;

const paymentMethod = await flutterwave.api.paymentMethods.create(
  paymentMethodData,
  traceId,
  idempotencyKey,
);
```

### 2. Validate Card Details Before Storage

```typescript
function validateCardDetails(card: any): boolean {
  const currentYear = new Date().getFullYear() % 100;
  const expiryYear = parseInt(card.expiry_year);

  if (expiryYear < currentYear) {
    throw new Error('Card has expired');
  }

  if (card.card_number.length < 13 || card.card_number.length > 19) {
    throw new Error('Invalid card number length');
  }

  return true;
}
```

### 3. Handle PCI Compliance

The SDK automatically encrypts sensitive card data before transmission:

```typescript
// Card details are automatically encrypted
const paymentMethod = await flutterwave.api.paymentMethods.create({
  type: 'card',
  customer_id: customerId,
  card: {
    card_number: '4242424242424242', // Encrypted before sending
    cvv: '123', // Encrypted before sending
    expiry_month: '12',
    expiry_year: '30',
  },
});
```

### 4. Associate with Customer

Always link payment methods to customers:

```typescript
async function createCustomerWithPaymentMethod(userData: any, cardData: any) {
  // First create customer
  const customer = await flutterwave.api.customers.create({
    email: userData.email,
    name: userData.name,
  });

  // Then store payment method
  const paymentMethod = await flutterwave.api.paymentMethods.create({
    type: 'card',
    customer_id: customer.id,
    card: cardData,
  });

  return { customer, paymentMethod };
}
```

## Security Considerations

### Card Data Encryption

The SDK uses your encryption key to encrypt sensitive card data:

```typescript
// Ensure you have encryption key configured
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY!, // Required for card operations
});
```

### Never Log Sensitive Data

```typescript
async function createPaymentMethod(cardData: any) {
  const paymentMethod = await flutterwave.api.paymentMethods.create({
    type: 'card',
    customer_id: 'customer_id',
    card: cardData,
  });

  // Good: Log only the ID
  console.log('Created payment method:', paymentMethod.id);

  // Bad: Never do this
  // console.log('Card details:', cardData);

  return paymentMethod;
}
```

## Error Handling

```typescript
try {
  const paymentMethod = await flutterwave.api.paymentMethods.create({
    type: 'card',
    customer_id: customerId,
    card: cardDetails,
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid payment method data:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed. Check encryption key.');
  } else {
    console.error('Failed to create payment method:', error);
  }
}
```

## Related APIs

- [Customers](/api/customers) - Create and manage customers
- [Charges](/api/charges) - Charge stored payment methods
- [Orders](/api/orders) - Create orders with payment methods
