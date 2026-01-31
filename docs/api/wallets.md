# Wallets API

The Wallets API provides access to your Flutterwave wallet balances and enables you to perform wallet operations like account resolution and statement retrieval.

## Methods

### balance()

Get wallet balance for a specific currency.

```typescript
async balance(currency: string): Promise<IWalletBalance>
```

#### Parameters

- `currency` - Three-letter currency code (e.g., 'NGN', 'USD', 'GBP')

#### Example

```typescript
const balance = await flutterwave.api.wallets.balance('NGN');

console.log('Currency:', balance.currency);
console.log('Available Balance:', balance.available_balance);
console.log('Total Balance:', balance.total_balance);
console.log('Ledger Balance:', balance.ledger_balance);
```

### balances()

Get wallet balances for all currencies.

```typescript
async balances(): Promise<IWalletBalance[]>
```

#### Example

```typescript
const balances = await flutterwave.api.wallets.balances();

balances.forEach((balance) => {
  console.log(`${balance.currency}: ${balance.available_balance}`);
});
```

### accountResolve()

Resolve and verify wallet account details.

```typescript
async accountResolve(data: {
  account_number: string;
  bank_code: string;
}): Promise<IWalletAccountResolved>
```

#### Parameters

- `account_number` - Account number to resolve
- `bank_code` - Bank code

#### Example

```typescript
const account = await flutterwave.api.wallets.accountResolve({
  account_number: '0690000031',
  bank_code: '044',
});

console.log('Account Name:', account.account_name);
console.log('Account Number:', account.account_number);
```

### statement()

Get wallet statement for a specific period.

```typescript
async statement(query: {
  from: string;
  to: string;
  currency?: string;
}): Promise<IWalletStatement[]>
```

#### Parameters

- `query.from` - Start date (ISO 8601 format)
- `query.to` - End date (ISO 8601 format)
- `query.currency` - Optional currency filter

#### Example

```typescript
const statement = await flutterwave.api.wallets.statement({
  from: '2025-04-01T00:00:00Z',
  to: '2025-04-30T23:59:59Z',
  currency: 'NGN',
});

statement.forEach((transaction) => {
  console.log(`${transaction.date}: ${transaction.amount} ${transaction.type}`);
});
```

## Type Definitions

### IWalletBalance

```typescript
interface IWalletBalance {
  currency: string;
  available_balance: number;
  total_balance: number;
  ledger_balance: number;
}
```

### IWalletAccountResolved

```typescript
interface IWalletAccountResolved {
  account_number: string;
  account_name: string;
}
```

### IWalletStatement

```typescript
interface IWalletStatement {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  narration: string;
  date: string;
}
```

## Use Cases

### Check Available Balance Before Transfer

```typescript
async function canAffordTransfer(
  amount: number,
  currency: string,
): Promise<boolean> {
  const balance = await flutterwave.api.wallets.balance(currency);

  if (balance.available_balance >= amount) {
    console.log('Sufficient balance');
    return true;
  } else {
    console.log(
      `Insufficient balance. Available: ${balance.available_balance}`,
    );
    return false;
  }
}
```

### Display All Wallet Balances

```typescript
async function displayWalletBalances() {
  const balances = await flutterwave.api.wallets.balances();

  console.log('Wallet Balances:');
  balances.forEach((balance) => {
    console.log(`  ${balance.currency}:`);
    console.log(`    Available: ${balance.available_balance}`);
    console.log(`    Total: ${balance.total_balance}`);
    console.log(`    Ledger: ${balance.ledger_balance}`);
  });

  return balances;
}
```

### Calculate Total Balance in Base Currency

```typescript
async function getTotalBalanceInNGN() {
  const balances = await flutterwave.api.wallets.balances();

  // Simplified example - you would need actual exchange rates
  let totalNGN = 0;

  for (const balance of balances) {
    if (balance.currency === 'NGN') {
      totalNGN += balance.available_balance;
    } else if (balance.currency === 'USD') {
      // Convert USD to NGN (use actual exchange rate)
      const rate = await getExchangeRate('USD', 'NGN');
      totalNGN += balance.available_balance * rate;
    }
    // Add more currencies as needed
  }

  return totalNGN;
}
```

### Validate Account Before Payment

```typescript
async function validateAccountBeforePayment(
  accountNumber: string,
  bankCode: string,
) {
  try {
    const account = await flutterwave.api.wallets.accountResolve({
      account_number: accountNumber,
      bank_code: bankCode,
    });

    console.log(`Paying: ${account.account_name}`);
    return account;
  } catch (error) {
    console.error('Invalid account details');
    throw error;
  }
}
```

### Generate Monthly Statement

```typescript
async function getMonthlyStatement(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const statement = await flutterwave.api.wallets.statement({
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  });

  const credits = statement.filter((txn) => txn.type === 'credit');
  const debits = statement.filter((txn) => txn.type === 'debit');

  const totalCredits = credits.reduce((sum, txn) => sum + txn.amount, 0);
  const totalDebits = debits.reduce((sum, txn) => sum + txn.amount, 0);

  return {
    statement,
    summary: {
      totalCredits,
      totalDebits,
      netChange: totalCredits - totalDebits,
    },
  };
}
```

## Best Practices

### 1. Cache Balance Checks

For performance, cache balance checks when appropriate:

```typescript
let balanceCache: {
  [currency: string]: { balance: number; timestamp: number };
} = {};
const CACHE_TTL = 60000; // 1 minute

async function getCachedBalance(currency: string): Promise<number> {
  const now = Date.now();
  const cached = balanceCache[currency];

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.balance;
  }

  const balance = await flutterwave.api.wallets.balance(currency);
  balanceCache[currency] = {
    balance: balance.available_balance,
    timestamp: now,
  };

  return balance.available_balance;
}
```

### 2. Monitor Low Balances

Set up alerts for low balances:

```typescript
async function checkLowBalances(threshold: number = 10000) {
  const balances = await flutterwave.api.wallets.balances();

  const lowBalances = balances.filter(
    (b) => b.available_balance < threshold && b.available_balance > 0,
  );

  if (lowBalances.length > 0) {
    console.log('Warning: Low balance detected!');
    lowBalances.forEach((balance) => {
      console.log(`  ${balance.currency}: ${balance.available_balance}`);
    });

    // Send notification
    await notifyAdmin('Low wallet balance', lowBalances);
  }

  return lowBalances;
}
```

### 3. Reconcile Transactions

Regularly reconcile your wallet transactions:

```typescript
async function reconcileTransactions(startDate: string, endDate: string) {
  const statement = await flutterwave.api.wallets.statement({
    from: startDate,
    to: endDate,
  });

  // Group by type
  const credits = statement.filter((t) => t.type === 'credit');
  const debits = statement.filter((t) => t.type === 'debit');

  // Calculate totals
  const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);

  console.log('Reconciliation Report:');
  console.log(`  Total Credits: ${totalCredits}`);
  console.log(`  Total Debits: ${totalDebits}`);
  console.log(`  Net: ${totalCredits - totalDebits}`);

  return {
    credits,
    debits,
    totalCredits,
    totalDebits,
  };
}
```

### 4. Handle Multiple Currencies

```typescript
async function getBalanceInPreferredCurrency(
  preferredCurrency: string = 'NGN',
) {
  const balances = await flutterwave.api.wallets.balances();

  const preferredBalance = balances.find(
    (b) => b.currency === preferredCurrency,
  );

  if (preferredBalance) {
    return preferredBalance.available_balance;
  }

  // If preferred currency not found, return first non-zero balance
  const nonZero = balances.find((b) => b.available_balance > 0);
  return nonZero?.available_balance || 0;
}
```

## Error Handling

```typescript
try {
  const balance = await flutterwave.api.wallets.balance('NGN');
  console.log('Available balance:', balance.available_balance);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid currency code:', error.message);
  } else {
    console.error('Failed to fetch balance:', error);
  }
}
```

## Balance Types

### Available Balance

The amount you can currently use for transfers and payments.

### Total Balance

Your total wallet balance including pending transactions.

### Ledger Balance

The accounting balance including all committed transactions.

## Important Notes

- Balance checks are real-time
- Statements may take a few moments to update after recent transactions
- Account resolution helps verify recipient details before transfers
- Always check available balance before initiating transfers

## Related APIs

- [Transfers](/api/transfers) - Send money from your wallet
- [Settlements](/api/settlements) - View settlement information
- [Virtual Accounts](/api/virtual-accounts) - Receive payments to your wallet
