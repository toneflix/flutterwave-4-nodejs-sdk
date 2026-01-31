# Settlements API

The Settlements API provides access to your settlement information, showing when and how much you've been paid out from your Flutterwave transactions.

## Methods

### list()

List all settlements with optional filters and pagination.

```typescript
async list(
  query?: {
    page?: number;
    size?: number;
  },
  traceId?: string
): Promise<{
  data: ISettlement[];
  meta: PageMeta;
}>
```

#### Parameters

- `query.page` - Page number (default: 1)
- `query.size` - Number of items per page (default: 10)
- `traceId` - Optional trace ID for request tracking

#### Example

```typescript
const result = await flutterwave.api.settlements.list(
  {
    page: 1,
    size: 20,
  },
  'trace-id',
);

console.log(`Found ${result.data.length} settlements`);
result.data.forEach((settlement) => {
  console.log(
    `${settlement.id} - ${settlement.net_amount} ${settlement.currency}`,
  );
});
```

### retrieve()

Get details of a specific settlement.

```typescript
async retrieve(
  id: string,
  traceId?: string
): Promise<ISettlement>
```

#### Example

```typescript
const settlement = await flutterwave.api.settlements.retrieve(
  'settlement_id',
  'trace-id',
);

console.log('Settlement ID:', settlement.id);
console.log('Net Amount:', settlement.net_amount);
console.log('Currency:', settlement.currency);
console.log('Status:', settlement.status);
```

## Type Definitions

### ISettlement

```typescript
interface ISettlement {
  id: string;
  net_amount: number;
  gross_amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  settlement_date: string;
  created_datetime: string;
}
```

## Use Cases

### List Recent Settlements

```typescript
async function getRecentSettlements() {
  const result = await flutterwave.api.settlements.list({
    page: 1,
    size: 10,
  });

  return result.data;
}
```

### Calculate Total Settlements

```typescript
async function calculateTotalSettlements() {
  let page = 1;
  let totalSettled = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await flutterwave.api.settlements.list({
      page,
      size: 100,
    });

    const completed = result.data.filter((s) => s.status === 'completed');
    totalSettled += completed.reduce((sum, s) => sum + s.net_amount, 0);

    hasMore = result.data.length === 100;
    page++;
  }

  return totalSettled;
}
```

### Monitor Settlement Status

```typescript
async function checkSettlementStatus(settlementId: string) {
  const settlement = await flutterwave.api.settlements.retrieve(settlementId);

  if (settlement.status === 'completed') {
    console.log('Settlement completed successfully');
  } else if (settlement.status === 'pending') {
    console.log('Settlement is being processed');
  } else if (settlement.status === 'failed') {
    console.log('Settlement failed, please contact support');
  }

  return settlement;
}
```

### Group Settlements by Currency

```typescript
async function groupSettlementsByCurrency() {
  const result = await flutterwave.api.settlements.list({
    page: 1,
    size: 100,
  });

  const grouped: Record<string, number> = {};

  result.data.forEach((settlement) => {
    if (settlement.status === 'completed') {
      grouped[settlement.currency] =
        (grouped[settlement.currency] || 0) + settlement.net_amount;
    }
  });

  return grouped;
}
```

## Best Practices

### 1. Regular Settlement Reconciliation

```typescript
async function reconcileSettlements(startDate: Date, endDate: Date) {
  const settlements: ISettlement[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await flutterwave.api.settlements.list({
      page,
      size: 100,
    });

    const filtered = result.data.filter((s) => {
      const settlementDate = new Date(s.settlement_date);
      return settlementDate >= startDate && settlementDate <= endDate;
    });

    settlements.push(...filtered);
    hasMore = result.data.length === 100;
    page++;
  }

  return settlements;
}
```

### 2. Monitor Pending Settlements

```typescript
async function monitorPendingSettlements() {
  const result = await flutterwave.api.settlements.list({
    page: 1,
    size: 100,
  });

  const pending = result.data.filter((s) => s.status === 'pending');

  if (pending.length > 0) {
    console.log(`${pending.length} pending settlements`);
    pending.forEach((s) => {
      console.log(`  ${s.id}: ${s.net_amount} ${s.currency}`);
    });
  }

  return pending;
}
```

### 3. Track Settlement Fees

```typescript
async function calculateSettlementFees() {
  const result = await flutterwave.api.settlements.list({
    page: 1,
    size: 100,
  });

  const totalFees = result.data.reduce((sum, s) => {
    const fee = s.gross_amount - s.net_amount;
    return sum + fee;
  }, 0);

  console.log(`Total settlement fees: ${totalFees}`);
  return totalFees;
}
```

## Error Handling

```typescript
try {
  const settlements = await flutterwave.api.settlements.list({
    page: 1,
    size: 20,
  });

  console.log(`Found ${settlements.data.length} settlements`);
} catch (error) {
  console.error('Failed to fetch settlements:', error.message);
}
```

## Settlement Lifecycle

1. **Pending** - Settlement scheduled but not yet processed
2. **Completed** - Funds successfully transferred to your account
3. **Failed** - Settlement failed (contact support)

## Important Notes

- Settlements typically occur based on your configured settlement schedule
- Net amount = Gross amount - Flutterwave fees
- Settlement dates may vary based on banking days and your settlement frequency
- Keep records of settlement IDs for accounting and reconciliation

## Related APIs

- [Transfers](/api/transfers) - Manage outgoing transfers
- [Wallets](/api/wallets) - Check your wallet balance
