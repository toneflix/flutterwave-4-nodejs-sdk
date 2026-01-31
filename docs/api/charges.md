# Charges API

The Charges API allows you to create and manage payment charges. Charges are immediate payment requests using stored payment methods.

## Methods

### create()

Create a new charge.

```typescript
async create(
  data: IChargeCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<ICharge>
```

#### Parameters

- `data` - Charge information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicate charges

#### Example

```typescript
const charge = await flutterwave.api.charges.create(
  {
    amount: 1000,
    currency: 'NGN',
    reference: `charge-${Date.now()}`,
    customer_id: 'customer_id_here',
    payment_method_id: 'pm_id_here',
  },
  'trace-id',
  'idem-key',
);

console.log('Charge ID:', charge.id);
console.log('Amount:', charge.amount);
console.log('Status:', charge.status);
```

### list()

List all charges with optional filters and pagination.

```typescript
async list(query?: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<{
  data: ICharge[];
  meta: PageMeta;
}>
```

#### Parameters

- `query.from` - Start date (ISO 8601 format)
- `query.to` - End date (ISO 8601 format)
- `query.page` - Page number (default: 1)
- `query.size` - Number of items per page (default: 10)

#### Example

```typescript
const result = await flutterwave.api.charges.list({
  from: '2025-04-21T10:55:16Z',
  to: '2025-04-30T23:59:59Z',
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} charges`);
result.data.forEach((charge) => {
  console.log(`${charge.reference} - ${charge.amount} ${charge.currency}`);
});
```

## Type Definitions

### IChargeCreateForm

```typescript
interface IChargeCreateForm {
  amount: number;
  currency: string;
  reference: string;
  customer_id: string;
  payment_method_id: string;
  meta?: Record<string, any>;
}
```

### ICharge

```typescript
interface ICharge {
  id: string;
  amount: number;
  currency: string;
  reference: string;
  status: 'pending' | 'successful' | 'failed';
  customer_id: string;
  payment_method_id: string;
  meta?: Record<string, any>;
  created_datetime: string;
}
```

## Use Cases

### One-Time Payment

```typescript
async function chargeCustomer(
  customerId: string,
  paymentMethodId: string,
  amount: number,
) {
  const charge = await flutterwave.api.charges.create({
    amount,
    currency: 'NGN',
    reference: `charge-${Date.now()}`,
    customer_id: customerId,
    payment_method_id: paymentMethodId,
  });

  if (charge.status === 'successful') {
    console.log('Payment successful!');
  }

  return charge;
}
```

### Recurring Subscription Charge

```typescript
async function chargeSubscription(subscriptionData: any) {
  const charge = await flutterwave.api.charges.create({
    amount: subscriptionData.amount,
    currency: 'NGN',
    reference: `sub-${subscriptionData.subscription_id}-${Date.now()}`,
    customer_id: subscriptionData.customer_id,
    payment_method_id: subscriptionData.payment_method_id,
    meta: {
      subscription_id: subscriptionData.subscription_id,
      billing_period: subscriptionData.period,
      plan: subscriptionData.plan,
    },
  });

  return charge;
}
```

## Best Practices

### 1. Use Unique References

```typescript
const reference = `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const charge = await flutterwave.api.charges.create({
  amount: 5000,
  currency: 'NGN',
  reference,
  customer_id: 'customer_id',
  payment_method_id: 'pm_id',
});
```

### 2. Implement Idempotency

```typescript
const idempotencyKey = `charge-${customerId}-${referenceId}`;

const charge = await flutterwave.api.charges.create(
  chargeData,
  traceId,
  idempotencyKey,
);
```

### 3. Check Charge Status

```typescript
async function processCharge(chargeData: any) {
  const charge = await flutterwave.api.charges.create(chargeData);

  if (charge.status === 'successful') {
    // Process successful payment
    await fulfillOrder(charge.id);
  } else if (charge.status === 'failed') {
    // Handle failed payment
    await notifyCustomer(charge.customer_id, 'payment_failed');
  }

  return charge;
}
```

## Error Handling

```typescript
try {
  const charge = await flutterwave.api.charges.create({
    amount: 5000,
    currency: 'NGN',
    reference: `charge-${Date.now()}`,
    customer_id: 'customer_id',
    payment_method_id: 'pm_id',
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid charge data:', error.message);
  } else {
    console.error('Failed to create charge:', error);
  }
}
```

## Charges vs Orders

**Charges** are immediate payment requests that are processed right away.

**Orders** support two-step payment (authorize and capture) for more complex payment flows.

Use **Charges** for:

- One-time payments
- Recurring subscriptions
- Immediate payment processing

Use **Orders** for:

- Pre-authorization scenarios
- Payments that need verification before capture
- Complex multi-step checkout flows

## Related APIs

- [Orders](/api/orders) - Two-step payment flow
- [Customers](/api/customers) - Create and manage customers
- [Payment Methods](/api/payment-methods) - Store payment methods
- [Refunds](/api/refunds) - Refund completed charges
