# Chargebacks API

The Chargebacks API allows you to create and manage payment disputes and chargebacks.

## Methods

### create()

Create a new chargeback record.

```typescript
async create(
  data: IChargebackCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<IChargeback>
```

#### Parameters

- `data` - Chargeback information
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicates

#### Example

```typescript
const chargeback = await flutterwave.api.chargebacks.create(
  {
    type: 'local',
    charge_id: 'charge_id_here',
    amount: 500,
    expiry: 7,
    stage: 'new',
    status: 'pending',
    comment: 'Customer disputed the charge',
    arn: '1243453453434234534443423',
  },
  'trace-id',
  'idem-key',
);

console.log('Chargeback ID:', chargeback.id);
console.log('Status:', chargeback.status);
```

### list()

List all chargebacks with optional filters and pagination.

```typescript
async list(query?: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<{
  data: IChargeback[];
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
const result = await flutterwave.api.chargebacks.list({
  from: '2025-04-01T00:00:00Z',
  to: '2025-04-30T23:59:59Z',
  page: 1,
  size: 20,
});

console.log(`Found ${result.data.length} chargebacks`);
result.data.forEach((chargeback) => {
  console.log(`${chargeback.arn} - ${chargeback.status}`);
});
```

## Type Definitions

### IChargebackCreateForm

```typescript
interface IChargebackCreateForm {
  type: 'local' | 'international';
  charge_id: string;
  amount: number;
  expiry: number; // Days until expiry
  stage: 'new' | 'pre_arbitration' | 'arbitration';
  status: 'pending' | 'accepted' | 'declined' | 'reversed';
  comment: string;
  arn: string; // Acquirer Reference Number
}
```

### IChargeback

```typescript
interface IChargeback {
  id: string;
  type: 'local' | 'international';
  charge_id: string;
  amount: number;
  expiry: number;
  stage: string;
  status: string;
  comment: string;
  arn: string;
  created_datetime: string;
  updated_datetime: string;
}
```

## Use Cases

### Create Chargeback for Dispute

```typescript
async function createDispute(
  chargeId: string,
  disputeAmount: number,
  reason: string,
) {
  const chargeback = await flutterwave.api.chargebacks.create({
    type: 'local',
    charge_id: chargeId,
    amount: disputeAmount,
    expiry: 7,
    stage: 'new',
    status: 'pending',
    comment: reason,
    arn: generateARN(),
  });

  return chargeback;
}

function generateARN(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
```

### Monitor Chargebacks

```typescript
async function getRecentChargebacks() {
  const result = await flutterwave.api.chargebacks.list({
    page: 1,
    size: 50,
  });

  const pendingChargebacks = result.data.filter(
    (cb) => cb.status === 'pending',
  );

  console.log(`${pendingChargebacks.length} pending chargebacks`);
  return pendingChargebacks;
}
```

## Best Practices

### 1. Track Chargeback Reasons

```typescript
const chargeback = await flutterwave.api.chargebacks.create({
  type: 'local',
  charge_id: 'charge_id',
  amount: 1000,
  expiry: 7,
  stage: 'new',
  status: 'pending',
  comment: 'Customer claims product not received. Tracking: ABC123',
  arn: generateARN(),
});
```

### 2. Set Appropriate Expiry

```typescript
// For local chargebacks
const localChargeback = await flutterwave.api.chargebacks.create({
  type: 'local',
  expiry: 7, // 7 days for local disputes
  // ...
});

// For international chargebacks
const intlChargeback = await flutterwave.api.chargebacks.create({
  type: 'international',
  expiry: 14, // 14 days for international disputes
  // ...
});
```

### 3. Monitor and Respond Promptly

```typescript
async function monitorChargebacks() {
  const result = await flutterwave.api.chargebacks.list({
    page: 1,
    size: 100,
  });

  const urgent = result.data.filter((cb) => {
    const created = new Date(cb.created_datetime);
    const now = new Date();
    const daysOld = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysOld >= cb.expiry - 2; // 2 days before expiry
  });

  if (urgent.length > 0) {
    await notifyTeam(`${urgent.length} chargebacks need urgent attention`);
  }
}
```

## Error Handling

```typescript
try {
  const chargeback = await flutterwave.api.chargebacks.create({
    type: 'local',
    charge_id: 'charge_id',
    amount: 500,
    expiry: 7,
    stage: 'new',
    status: 'pending',
    comment: 'Disputed transaction',
    arn: generateARN(),
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid chargeback data:', error.message);
  } else {
    console.error('Failed to create chargeback:', error);
  }
}
```

## Chargeback Lifecycle

1. **New** - Chargeback initiated
2. **Pre-arbitration** - Under review
3. **Arbitration** - Escalated dispute
4. **Accepted** - Chargeback accepted, funds returned to customer
5. **Declined** - Chargeback declined, merchant keeps funds
6. **Reversed** - Chargeback reversed after evidence provided

## Related APIs

- [Charges](/api/charges) - Create and manage charges
- [Refunds](/api/refunds) - Process voluntary refunds
