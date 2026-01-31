# Refunds API

The Refunds API allows you to process refunds for completed transactions.

## Methods

### list()

List all refunds with optional filters and pagination.

```typescript
async list(query?: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<{
  data: IRefund[];
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
const result = await flutterwave.api.refunds.list({
  from: '2025-04-01T00:00:00Z',
  to: '2025-04-30T23:59:59Z',
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} refunds`);
result.data.forEach((refund) => {
  console.log(`${refund.id} - ${refund.amount} ${refund.currency}`);
});
```

## Type Definitions

### IRefund

```typescript
interface IRefund {
  id: string;
  charge_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  created_datetime: string;
  updated_datetime: string;
}
```

## Use Cases

### List Recent Refunds

```typescript
async function getRecentRefunds() {
  const now = new Date();
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const result = await flutterwave.api.refunds.list({
    from: lastMonth.toISOString(),
    to: now.toISOString(),
    page: 1,
    size: 50,
  });

  return result.data;
}
```

### Monitor Refund Status

```typescript
async function getPendingRefunds() {
  const result = await flutterwave.api.refunds.list({
    page: 1,
    size: 100,
  });

  const pending = result.data.filter((refund) => refund.status === 'pending');

  console.log(`${pending.length} pending refunds`);
  return pending;
}
```

## Best Practices

### 1. Track Refund Reasons

When initiating refunds through other means, document the reasons for your records.

### 2. Monitor Refund Status

```typescript
async function monitorRefunds() {
  const result = await flutterwave.api.refunds.list({
    page: 1,
    size: 100,
  });

  const completed = result.data.filter((r) => r.status === 'completed');
  const failed = result.data.filter((r) => r.status === 'failed');

  console.log(`Completed: ${completed.length}, Failed: ${failed.length}`);

  return { completed, failed };
}
```

### 3. Reconcile Refunds

```typescript
async function reconcileRefunds(startDate: string, endDate: string) {
  const result = await flutterwave.api.refunds.list({
    from: startDate,
    to: endDate,
    page: 1,
    size: 1000,
  });

  const totalRefunded = result.data
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  console.log(`Total refunded: ${totalRefunded}`);

  return result.data;
}
```

## Error Handling

```typescript
try {
  const refunds = await flutterwave.api.refunds.list({
    from: '2025-04-01T00:00:00Z',
    to: '2025-04-30T23:59:59Z',
  });

  console.log(`Found ${refunds.data.length} refunds`);
} catch (error) {
  console.error('Failed to fetch refunds:', error.message);
}
```

## Refund Lifecycle

1. **Pending** - Refund initiated and being processed
2. **Completed** - Refund successfully processed, funds returned to customer
3. **Failed** - Refund failed, funds not returned

## Related APIs

- [Charges](/api/charges) - Create and manage charges
- [Orders](/api/orders) - Create and manage orders
- [Chargebacks](/api/chargebacks) - Handle payment disputes
