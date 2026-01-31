# Orders API

The Orders API allows you to create and manage payment orders. Orders represent a payment request that can be authorized and captured separately.

## Methods

### create()

Create a new payment order.

```typescript
async create(
  data: IOrderCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<IOrder>
```

#### Parameters

- `data` - Order information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicate orders

#### Example

```typescript
const order = await flutterwave.api.orders.create(
  {
    amount: 5000,
    currency: 'NGN',
    reference: `order-${Date.now()}`,
    customer_id: 'customer_id_here',
    payment_method_id: 'pm_id_here',
    meta: {
      order_number: 'ORD-12345',
      items: ['item1', 'item2'],
    },
  },
  'trace-id',
  'idem-key',
);

console.log('Order ID:', order.id);
console.log('Amount:', order.amount);
console.log('Status:', order.status);
```

### list()

List all orders with optional filters and pagination.

```typescript
async list(query?: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<{
  data: IOrder[];
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
const result = await flutterwave.api.orders.list({
  from: '2025-04-21T10:55:16Z',
  to: '2025-04-30T23:59:59Z',
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} orders`);
result.data.forEach((order) => {
  console.log(`${order.reference} - ${order.amount} ${order.currency}`);
});
```

### retrieve()

Get details of a specific order.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<IOrder>
```

#### Example

```typescript
const order = await flutterwave.api.orders.retrieve('order_id', 'trace-id');

console.log('Order:', order);
console.log('Status:', order.status);
console.log('Amount:', order.amount);
```

### update()

Update an order (e.g., capture authorized payment).

```typescript
async update(
  id: string,
  data: IOrderUpdateForm,
  traceId?: string,
  scenarioKey?: string
): Promise<IOrder>
```

#### Parameters

- `id` - Order ID
- `data` - Update data
- `traceId` - Optional trace ID
- `scenarioKey` - Optional scenario key for testing

#### Example: Capture Order

```typescript
const updated = await flutterwave.api.orders.update(
  'order_id',
  {
    action: 'capture',
    meta: {
      captured_by: 'admin',
      notes: 'Payment captured successfully',
    },
  },
  'trace-id',
  'scenario-key',
);

console.log('Status:', updated.status); // 'completed'
```

## Type Definitions

### IOrderCreateForm

```typescript
interface IOrderCreateForm {
  amount: number;
  currency: string;
  reference: string;
  customer_id: string;
  payment_method_id: string;
  meta?: Record<string, any>;
}
```

### IOrderUpdateForm

```typescript
interface IOrderUpdateForm {
  action: 'capture' | 'cancel';
  meta?: Record<string, any>;
}
```

### IOrder

```typescript
interface IOrder {
  id: string;
  amount: number;
  currency: string;
  reference: string;
  status: 'pending' | 'authorized' | 'completed' | 'cancelled';
  customer_id: string;
  payment_method_id: string;
  meta?: Record<string, any>;
  created_datetime: string;
  updated_datetime: string;
}
```

## Use Cases

### Two-Step Payment (Authorize and Capture)

```typescript
async function authorizeAndCapturePayment() {
  // Step 1: Create order (authorizes the payment)
  const order = await flutterwave.api.orders.create({
    amount: 10000,
    currency: 'NGN',
    reference: `order-${Date.now()}`,
    customer_id: 'customer_id',
    payment_method_id: 'payment_method_id',
  });

  console.log('Payment authorized:', order.id);

  // Step 2: Verify order details or perform business logic
  // ...

  // Step 3: Capture the payment
  const captured = await flutterwave.api.orders.update(order.id, {
    action: 'capture',
  });

  console.log('Payment captured:', captured.status);
}
```

### Create Order with Metadata

```typescript
const order = await flutterwave.api.orders.create({
  amount: 25000,
  currency: 'NGN',
  reference: `order-${Date.now()}`,
  customer_id: 'customer_id',
  payment_method_id: 'pm_id',
  meta: {
    order_type: 'subscription',
    plan: 'premium_monthly',
    billing_cycle: '2025-02',
    items: [
      { name: 'Premium Plan', price: 20000 },
      { name: 'Add-on Feature', price: 5000 },
    ],
  },
});
```

### List Recent Orders

```typescript
async function getRecentOrders() {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const result = await flutterwave.api.orders.list({
    from: lastWeek.toISOString(),
    to: now.toISOString(),
    page: 1,
    size: 50,
  });

  return result.data;
}
```

### Cancel Uncaptured Order

```typescript
async function cancelOrder(orderId: string) {
  const cancelled = await flutterwave.api.orders.update(orderId, {
    action: 'cancel',
    meta: {
      reason: 'Customer requested cancellation',
      cancelled_by: 'customer_service',
    },
  });

  return cancelled;
}
```

## Best Practices

### 1. Use Unique References

Always use unique references for orders:

```typescript
const reference = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const order = await flutterwave.api.orders.create({
  amount: 5000,
  currency: 'NGN',
  reference,
  customer_id: 'customer_id',
  payment_method_id: 'pm_id',
});
```

### 2. Store Order IDs

Keep track of order IDs in your database:

```typescript
async function createAndStoreOrder(orderData: any) {
  const order = await flutterwave.api.orders.create(orderData);

  // Store in your database
  await db.orders.create({
    flutterwave_order_id: order.id,
    amount: order.amount,
    status: order.status,
    reference: order.reference,
  });

  return order;
}
```

### 3. Implement Idempotency

Prevent duplicate orders during retries:

```typescript
const idempotencyKey = `order-${customerId}-${orderReference}`;

const order = await flutterwave.api.orders.create(
  orderData,
  traceId,
  idempotencyKey,
);
```

### 4. Add Comprehensive Metadata

Use metadata to store order-specific information:

```typescript
const order = await flutterwave.api.orders.create({
  amount: 15000,
  currency: 'NGN',
  reference: `order-${Date.now()}`,
  customer_id: 'customer_id',
  payment_method_id: 'pm_id',
  meta: {
    internal_order_id: 'ORD-12345',
    shipping_address: '123 Main St, Lagos',
    items: [
      { sku: 'PROD-001', quantity: 2, price: 5000 },
      { sku: 'PROD-002', quantity: 1, price: 5000 },
    ],
    discount_code: 'SAVE10',
    notes: 'Express delivery requested',
  },
});
```

## Error Handling

```typescript
try {
  const order = await flutterwave.api.orders.create({
    amount: 5000,
    currency: 'NGN',
    reference: `order-${Date.now()}`,
    customer_id: 'customer_id',
    payment_method_id: 'pm_id',
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid order data:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed');
  } else {
    console.error('Failed to create order:', error);
  }
}
```

## Related APIs

- [Customers](/api/customers) - Create and manage customers
- [Payment Methods](/api/payment-methods) - Store payment methods
- [Charges](/api/charges) - Direct charges vs orders
- [Refunds](/api/refunds) - Refund completed orders
