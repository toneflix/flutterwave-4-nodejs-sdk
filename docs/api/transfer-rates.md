# Transfer Rates API

The Transfer Rates API allows you to get exchange rates for cross-currency transfers and lock in rates for transactions.

## Methods

### convert()

Convert an amount and get the exchange rate.

```typescript
async convert(
  data: ITransferRateConvertForm,
  traceId?: string
): Promise<ITransferRate>
```

#### Parameters

- `data` - Conversion details
- `traceId` - Optional trace ID for request tracking

#### Example

```typescript
const rate = await flutterwave.api.transferRates.convert(
  {
    source: {
      currency: 'USD',
    },
    destination: {
      amount: '100',
      currency: 'NGN',
    },
    precision: 4,
  },
  'trace-id',
);

console.log('Rate ID:', rate.id);
console.log('Exchange Rate:', rate.rate);
console.log('Source Currency:', rate.source.currency);
console.log('Destination Currency:', rate.destination.currency);
```

### fetch()

Fetch a previously converted rate by ID.

```typescript
async fetch(
  id: string,
  traceId?: string
): Promise<ITransferRate>
```

#### Example

```typescript
const rate = await flutterwave.api.transferRates.fetch('rate_id', 'trace-id');

console.log('Rate:', rate.rate);
console.log('Valid until:', rate.expiry_datetime);
```

## Type Definitions

### ITransferRateConvertForm

```typescript
interface ITransferRateConvertForm {
  source: {
    currency: string;
    amount?: string;
  };
  destination: {
    currency: string;
    amount?: string;
  };
  precision?: number; // Number of decimal places (default: 4)
}
```

### ITransferRate

```typescript
interface ITransferRate {
  id: string;
  rate: number;
  source: {
    currency: string;
    amount?: number;
  };
  destination: {
    currency: string;
    amount?: number;
  };
  created_datetime: string;
  expiry_datetime: string;
}
```

## Use Cases

### Get Exchange Rate for Transfer

```typescript
async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  amount: string,
) {
  const rate = await flutterwave.api.transferRates.convert({
    source: {
      currency: fromCurrency,
    },
    destination: {
      amount,
      currency: toCurrency,
    },
    precision: 4,
  });

  console.log(`1 ${fromCurrency} = ${rate.rate} ${toCurrency}`);
  return rate;
}
```

### Calculate Transfer Amount

```typescript
async function calculateTransferAmount(
  sourceAmount: number,
  sourceCurrency: string,
  destinationCurrency: string,
) {
  const rate = await flutterwave.api.transferRates.convert({
    source: {
      currency: sourceCurrency,
      amount: sourceAmount.toString(),
    },
    destination: {
      currency: destinationCurrency,
    },
    precision: 2,
  });

  console.log(
    `${sourceAmount} ${sourceCurrency} = ${rate.destination.amount} ${destinationCurrency}`,
  );
  return rate;
}
```

### Lock Rate for Transfer

```typescript
async function lockRateForTransfer(
  sourceCurrency: string,
  destinationCurrency: string,
  destinationAmount: string,
) {
  // Get and lock the rate
  const rate = await flutterwave.api.transferRates.convert({
    source: { currency: sourceCurrency },
    destination: { amount: destinationAmount, currency: destinationCurrency },
  });

  // Store the rate ID
  const rateId = rate.id;

  // Later, use this rate ID in your transfer
  return {
    rateId,
    rate: rate.rate,
    expiresAt: rate.expiry_datetime,
  };
}
```

### Retrieve Locked Rate

```typescript
async function getLockedRate(rateId: string) {
  const rate = await flutterwave.api.transferRates.fetch(rateId);

  const now = new Date();
  const expiry = new Date(rate.expiry_datetime);

  if (now > expiry) {
    console.log('Rate has expired, get a new one');
    return null;
  }

  return rate;
}
```

## Best Practices

### 1. Check Rate Expiry

```typescript
async function isRateValid(rateId: string): Promise<boolean> {
  const rate = await flutterwave.api.transferRates.fetch(rateId);
  const now = new Date();
  const expiry = new Date(rate.expiry_datetime);

  return now <= expiry;
}
```

### 2. Display Exchange Rate to Users

```typescript
async function displayExchangeRate(from: string, to: string, amount: string) {
  const rate = await flutterwave.api.transferRates.convert({
    source: { currency: from },
    destination: { amount, currency: to },
    precision: 4,
  });

  console.log('Exchange Rate Breakdown:');
  console.log(`Amount to send: ${rate.source.amount} ${from}`);
  console.log(`Recipient gets: ${rate.destination.amount} ${to}`);
  console.log(`Exchange rate: 1 ${from} = ${rate.rate} ${to}`);
  console.log(`Rate valid until: ${rate.expiry_datetime}`);

  return rate;
}
```

### 3. Handle Multiple Currencies

```typescript
async function getMultipleCurrencyRates(
  baseCurrency: string,
  targetCurrencies: string[],
) {
  const rates: Record<string, ITransferRate> = {};

  for (const targetCurrency of targetCurrencies) {
    rates[targetCurrency] = await flutterwave.api.transferRates.convert({
      source: { currency: baseCurrency },
      destination: { amount: '100', currency: targetCurrency },
    });
  }

  return rates;
}
```

### 4. Implement Rate Comparison

```typescript
async function compareRates(
  amount: string,
  fromCurrency: string,
  toCurrency: string,
) {
  // Get current rate
  const currentRate = await flutterwave.api.transferRates.convert({
    source: { currency: fromCurrency },
    destination: { amount, currency: toCurrency },
  });

  // Wait a bit and get another rate
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const laterRate = await flutterwave.api.transferRates.convert({
    source: { currency: fromCurrency },
    destination: { amount, currency: toCurrency },
  });

  console.log('Rate movement:', laterRate.rate - currentRate.rate);

  return { currentRate, laterRate };
}
```

## Error Handling

```typescript
try {
  const rate = await flutterwave.api.transferRates.convert({
    source: { currency: 'USD' },
    destination: { amount: '100', currency: 'NGN' },
  });

  console.log('Exchange rate:', rate.rate);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid currency or amount:', error.message);
  } else {
    console.error('Failed to get rate:', error);
  }
}
```

## Important Notes

- Rates expire after a certain period (check `expiry_datetime`)
- Locked rates can be used in transfer transactions
- Precision parameter controls decimal places (2-4 recommended)
- Rates are real-time and may fluctuate
- Store rate IDs if you need to reference them later

## Related APIs

- [Transfers](/api/transfers) - Create cross-currency transfers
- [Transfer Recipients](/api/transfer-recipients) - Manage transfer recipients
