# Fees API

The Fees API allows you to calculate transaction fees before processing payments.

## Methods

### retrieve()

Calculate the fee for a transaction.

```typescript
async retrieve(
  data: IFeeRetrieveForm,
  traceId?: string
): Promise<IFee>
```

#### Parameters

- `data` - Transaction details for fee calculation
- `traceId` - Optional trace ID for request tracking

#### Example

```typescript
const feeInfo = await flutterwave.api.fees.retrieve(
  {
    amount: 12.34,
    currency: 'NGN',
    payment_method: 'card',
    card6: '424242',
    country: 'NG',
  },
  'trace-id',
);

console.log('Charge Amount:', feeInfo.charge_amount);
console.log('Fees:', feeInfo.fee);
```

## Type Definitions

### IFeeRetrieveForm

```typescript
interface IFeeRetrieveForm {
  amount: number;
  currency: string;
  payment_method: 'card' | 'bank_transfer' | 'mobile_money' | 'ussd';
  card6?: string; // First 6 digits of card (for card payments)
  country: string; // Two-letter country code
}
```

### IFee

```typescript
interface IFee {
  charge_amount: number;
  fee: Array<{
    type: string;
    amount: number;
    currency: string;
  }>;
}
```

## Use Cases

### Calculate Card Payment Fee

```typescript
async function calculateCardFee(amount: number, cardBin: string) {
  const feeInfo = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: 'card',
    card6: cardBin,
    country: 'NG',
  });

  const totalFee = feeInfo.fee.reduce((sum, f) => sum + f.amount, 0);

  console.log(`Amount: ${amount}`);
  console.log(`Fee: ${totalFee}`);
  console.log(`Total: ${feeInfo.charge_amount}`);

  return feeInfo;
}
```

### Display Fee Breakdown

```typescript
async function showFeeBreakdown(amount: number) {
  const feeInfo = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: 'card',
    card6: '424242',
    country: 'NG',
  });

  console.log('Fee Breakdown:');
  feeInfo.fee.forEach((fee) => {
    console.log(`  ${fee.type}: ${fee.amount} ${fee.currency}`);
  });

  return feeInfo;
}
```

### Calculate Different Payment Methods

```typescript
async function compareFees(amount: number) {
  const cardFee = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: 'card',
    card6: '424242',
    country: 'NG',
  });

  const bankFee = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: 'bank_transfer',
    country: 'NG',
  });

  return {
    card: cardFee.charge_amount,
    bank: bankFee.charge_amount,
  };
}
```

## Best Practices

### 1. Show Fees Before Payment

Display fees to customers before they complete payment:

```typescript
async function displayCheckout(amount: number, paymentMethod: string) {
  const feeInfo = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: paymentMethod as any,
    country: 'NG',
  });

  console.log('Subtotal:', amount);
  console.log('Processing Fee:', feeInfo.charge_amount - amount);
  console.log('Total:', feeInfo.charge_amount);

  return feeInfo;
}
```

### 2. Cache Fee Calculations

For similar transactions, cache fee calculations to reduce API calls:

```typescript
const feeCache = new Map<string, IFee>();

async function getCachedFee(
  amount: number,
  paymentMethod: string,
): Promise<IFee> {
  const cacheKey = `${amount}-${paymentMethod}`;

  if (feeCache.has(cacheKey)) {
    return feeCache.get(cacheKey)!;
  }

  const feeInfo = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: paymentMethod as any,
    country: 'NG',
  });

  feeCache.set(cacheKey, feeInfo);
  return feeInfo;
}
```

### 3. Handle Fee Absorption

Decide whether to pass fees to customers or absorb them:

```typescript
async function calculateTotalWithFeeHandling(
  amount: number,
  absorbFee: boolean,
) {
  const feeInfo = await flutterwave.api.fees.retrieve({
    amount,
    currency: 'NGN',
    payment_method: 'card',
    card6: '424242',
    country: 'NG',
  });

  if (absorbFee) {
    // Merchant absorbs fee
    return {
      customerPays: amount,
      merchantReceives: amount - (feeInfo.charge_amount - amount),
    };
  } else {
    // Customer pays fee
    return {
      customerPays: feeInfo.charge_amount,
      merchantReceives: amount,
    };
  }
}
```

## Error Handling

```typescript
try {
  const feeInfo = await flutterwave.api.fees.retrieve({
    amount: 100,
    currency: 'NGN',
    payment_method: 'card',
    card6: '424242',
    country: 'NG',
  });

  console.log('Fee calculated:', feeInfo.charge_amount);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid fee request:', error.message);
  } else {
    console.error('Failed to calculate fee:', error);
  }
}
```

## Important Notes

1. Fee structures may vary based on:
   - Payment method
   - Card type (local vs international)
   - Transaction amount
   - Country

2. Always call this endpoint for accurate, real-time fee calculation

3. Fees are subject to change based on Flutterwave's pricing

## Related APIs

- [Charges](/api/charges) - Create charges with fees
- [Orders](/api/orders) - Create orders with fees
