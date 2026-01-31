# Wallet Operations

This guide provides comprehensive examples for managing wallet operations using the Flutterwave SDK. You can check balances, view statements, and resolve wallet accounts.

## Overview

The Wallets API allows you to:

- Check balance for a specific currency
- Get balances for all currencies
- View wallet statements (transaction history)
- Resolve wallet account information

## Balance Operations

### Get Balance for Specific Currency

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: 'sandbox',
});

const balance = await flutterwave.api.wallets.balance('NGN');

console.log('Currency:', balance.currency);
console.log('Available Balance:', balance.available_balance);
console.log('Total Balance:', balance.total_balance);
console.log('Ledger Balance:', balance.ledger_balance);
```

### Get All Currency Balances

```typescript
const balances = await flutterwave.api.wallets.balances();

console.log(`You have balances in ${balances.length} currencies`);

balances.forEach((balance) => {
  console.log(`${balance.currency}: ${balance.available_balance}`);
});
```

### Understanding Balance Types

```typescript
const balance = await flutterwave.api.wallets.balance('NGN');

// Available Balance - Funds available for withdrawal/transfer
console.log('Available:', balance.available_balance);

// Total Balance - All funds in the wallet
console.log('Total:', balance.total_balance);

// Ledger Balance - Balance including pending transactions
console.log('Ledger:', balance.ledger_balance);

// The difference shows funds that are locked or pending
const locked = balance.total_balance - balance.available_balance;
console.log('Locked/Pending:', locked);
```

## Multi-Currency Operations

### Check Multiple Currencies

```typescript
async function checkMultipleCurrencies(currencies: string[]) {
  const results = [];

  for (const currency of currencies) {
    try {
      const balance = await flutterwave.api.wallets.balance(currency);
      results.push({
        currency,
        available: balance.available_balance,
        total: balance.total_balance,
      });
    } catch (error) {
      results.push({
        currency,
        error: 'Unable to fetch balance',
      });
    }
  }

  return results;
}

// Usage
const balances = await checkMultipleCurrencies(['NGN', 'USD', 'GHS', 'KES']);

balances.forEach((balance) => {
  if ('error' in balance) {
    console.log(`${balance.currency}: ${balance.error}`);
  } else {
    console.log(`${balance.currency}: ${balance.available}`);
  }
});
```

### Compare Balances Across Currencies

```typescript
async function compareBalances() {
  const balances = await flutterwave.api.wallets.balances();

  console.log('Balance Comparison:');
  console.log('===================');

  balances
    .sort((a, b) => b.available_balance - a.available_balance)
    .forEach((balance, index) => {
      console.log(
        `${index + 1}. ${balance.currency}: ${balance.available_balance.toLocaleString()}`,
      );
    });
}

await compareBalances();
```

## Account Resolution

### Resolve Wallet Account

```typescript
const resolved = await flutterwave.api.wallets.accountResolve({
  provider: 'flutterwave',
  identifier: '00118468',
});

console.log('Account Identifier:', resolved.identifier);
console.log('Account Name:', resolved.name);
console.log('Provider:', resolved.provider);
```

### Batch Account Resolution

```typescript
async function resolveMultipleAccounts(identifiers: string[]) {
  const results = [];

  for (const identifier of identifiers) {
    try {
      const resolved = await flutterwave.api.wallets.accountResolve({
        provider: 'flutterwave',
        identifier,
      });

      results.push({
        identifier,
        name: resolved.name,
        provider: resolved.provider,
        success: true,
      });
    } catch (error) {
      results.push({
        identifier,
        error: error instanceof Error ? error.message : 'Resolution failed',
        success: false,
      });
    }
  }

  return results;
}

// Usage
const accounts = await resolveMultipleAccounts([
  '00118468',
  '00118469',
  '00118470',
]);

accounts.forEach((account) => {
  if (account.success) {
    console.log(`${account.identifier}: ${account.name}`);
  } else {
    console.log(`${account.identifier}: Failed - ${account.error}`);
  }
});
```

## Wallet Statements

### Get Transaction Statement

```typescript
const statement = await flutterwave.api.wallets.statement({
  page: 1,
  size: 20,
  currency: 'NGN',
});

console.log(`Total Transactions: ${statement.meta.total}`);
console.log(`Current Page: ${statement.meta.current_page}`);

statement.data.forEach((transaction) => {
  console.log(
    `${transaction.date}: ${transaction.type} - ${transaction.amount} ${transaction.currency}`,
  );
});
```

### Filter Statements by Date Range

```typescript
async function getStatementByDateRange(
  startDate: Date,
  endDate: Date,
  currency: string = 'NGN',
) {
  const statement = await flutterwave.api.wallets.statement({
    page: 1,
    size: 100,
    currency,
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  });

  return statement;
}

// Usage - Get last 30 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);

const recentTransactions = await getStatementByDateRange(startDate, endDate);
console.log('Transactions in last 30 days:', recentTransactions.data.length);
```

### Paginated Statement Retrieval

```typescript
async function getAllStatementPages(currency: string = 'NGN') {
  const allTransactions = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const statement = await flutterwave.api.wallets.statement({
      page: currentPage,
      size: 50,
      currency,
    });

    allTransactions.push(...statement.data);

    hasMore = currentPage < statement.meta.total_pages;
    currentPage++;
  }

  return allTransactions;
}

// Usage
const allTransactions = await getAllStatementPages('NGN');
console.log('Total transactions:', allTransactions.length);
```

## Balance Monitoring

### Monitor Balance Changes

```typescript
interface BalanceSnapshot {
  timestamp: Date;
  currency: string;
  available: number;
  total: number;
  ledger: number;
}

const balanceHistory: BalanceSnapshot[] = [];

async function takeBalanceSnapshot(currency: string): Promise<BalanceSnapshot> {
  const balance = await flutterwave.api.wallets.balance(currency);

  const snapshot: BalanceSnapshot = {
    timestamp: new Date(),
    currency: balance.currency,
    available: balance.available_balance,
    total: balance.total_balance,
    ledger: balance.ledger_balance,
  };

  balanceHistory.push(snapshot);

  return snapshot;
}

// Take snapshots every hour
setInterval(
  async () => {
    await takeBalanceSnapshot('NGN');
    console.log('Balance snapshot taken');
  },
  60 * 60 * 1000,
);
```

### Alert on Low Balance

```typescript
async function checkBalanceAndAlert(
  currency: string,
  threshold: number,
  alertCallback: (balance: number) => void,
) {
  const balance = await flutterwave.api.wallets.balance(currency);

  if (balance.available_balance < threshold) {
    console.warn(`Low balance alert for ${currency}!`);
    console.warn(
      `Current: ${balance.available_balance}, Threshold: ${threshold}`,
    );
    alertCallback(balance.available_balance);
  }

  return balance;
}

// Usage
await checkBalanceAndAlert('NGN', 100000, (balance) => {
  // Send email, SMS, or push notification
  console.log(`ALERT: Balance is ${balance}, please top up!`);
});
```

### Track Balance Trends

```typescript
interface BalanceTrend {
  currency: string;
  startBalance: number;
  endBalance: number;
  change: number;
  changePercentage: number;
  period: string;
}

async function analyzeBalanceTrend(
  currency: string,
  periodDays: number = 7,
): Promise<BalanceTrend> {
  // Get current balance
  const currentBalance = await flutterwave.api.wallets.balance(currency);

  // Get balance from history (in a real app, fetch from database)
  const startSnapshot = balanceHistory.find(
    (s) =>
      s.currency === currency &&
      s.timestamp.getTime() <= Date.now() - periodDays * 24 * 60 * 60 * 1000,
  );

  if (!startSnapshot) {
    throw new Error('No historical data available');
  }

  const change = currentBalance.available_balance - startSnapshot.available;
  const changePercentage = (change / startSnapshot.available) * 100;

  return {
    currency,
    startBalance: startSnapshot.available,
    endBalance: currentBalance.available_balance,
    change,
    changePercentage,
    period: `${periodDays} days`,
  };
}

// Usage
const trend = await analyzeBalanceTrend('NGN', 30);
console.log(
  `Balance changed by ${trend.change} (${trend.changePercentage.toFixed(2)}%) over ${trend.period}`,
);
```

## Transaction Analysis

### Calculate Total Income and Expenses

```typescript
async function analyzeTransactions(currency: string = 'NGN') {
  const statement = await flutterwave.api.wallets.statement({
    page: 1,
    size: 1000,
    currency,
  });

  let income = 0;
  let expenses = 0;

  statement.data.forEach((transaction) => {
    if (transaction.type === 'credit') {
      income += transaction.amount;
    } else if (transaction.type === 'debit') {
      expenses += transaction.amount;
    }
  });

  return {
    currency,
    income,
    expenses,
    net: income - expenses,
    transactionCount: statement.data.length,
  };
}

// Usage
const analysis = await analyzeTransactions('NGN');
console.log('Income:', analysis.income);
console.log('Expenses:', analysis.expenses);
console.log('Net:', analysis.net);
```

### Group Transactions by Type

```typescript
async function groupTransactionsByType(currency: string = 'NGN') {
  const statement = await flutterwave.api.wallets.statement({
    page: 1,
    size: 1000,
    currency,
  });

  const grouped = statement.data.reduce(
    (acc, transaction) => {
      const type = transaction.type || 'unknown';
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          total: 0,
          transactions: [],
        };
      }

      acc[type].count++;
      acc[type].total += transaction.amount;
      acc[type].transactions.push(transaction);

      return acc;
    },
    {} as Record<string, { count: number; total: number; transactions: any[] }>,
  );

  return grouped;
}

// Usage
const grouped = await groupTransactionsByType('NGN');

Object.entries(grouped).forEach(([type, data]) => {
  console.log(`${type}: ${data.count} transactions, Total: ${data.total}`);
});
```

## Balance Reconciliation

### Reconcile Expected vs Actual Balance

```typescript
interface ExpectedTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

async function reconcileBalance(
  currency: string,
  expectedTransactions: ExpectedTransaction[],
) {
  const actualBalance = await flutterwave.api.wallets.balance(currency);

  // Calculate expected balance
  const expectedChange = expectedTransactions.reduce((sum, tx) => {
    return sum + (tx.type === 'credit' ? tx.amount : -tx.amount);
  }, 0);

  // Get statement to verify
  const statement = await flutterwave.api.wallets.statement({
    page: 1,
    size: 100,
    currency,
  });

  return {
    currency,
    actualAvailable: actualBalance.available_balance,
    actualTotal: actualBalance.total_balance,
    expectedChange,
    matchedTransactions: statement.data.length,
    reconciled: true, // Add your reconciliation logic
  };
}

// Usage
const reconciliation = await reconcileBalance('NGN', [
  { amount: 10000, type: 'credit', description: 'Payment received' },
  { amount: 5000, type: 'debit', description: 'Transfer sent' },
]);

console.log('Reconciliation Result:', reconciliation);
```

## Error Handling

### Robust Balance Check

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
} from 'flutterwave-node-v4';

async function safeGetBalance(currency: string) {
  try {
    const balance = await flutterwave.api.wallets.balance(currency);

    return {
      success: true,
      data: balance,
    };
  } catch (error) {
    if (error instanceof BadRequestException) {
      console.error('Invalid currency:', error.message);
      return {
        success: false,
        error: 'Invalid currency code',
        message: 'Please provide a valid currency code',
      };
    } else if (error instanceof UnauthorizedRequestException) {
      console.error('Authentication failed:', error.message);
      return {
        success: false,
        error: 'Authentication error',
        message: 'Please check your credentials',
      };
    } else {
      console.error('Failed to get balance:', error);
      return {
        success: false,
        error: 'Balance fetch failed',
        message: 'An unexpected error occurred',
      };
    }
  }
}

// Usage
const result = await safeGetBalance('NGN');

if (result.success) {
  console.log('Balance:', result.data.available_balance);
} else {
  console.error('Error:', result.message);
}
```

## Best Practices

### 1. Cache Balance Data

```typescript
interface BalanceCache {
  balance: any;
  timestamp: number;
  currency: string;
}

const balanceCache: Map<string, BalanceCache> = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute

async function getCachedBalance(currency: string) {
  const cached = balanceCache.get(currency);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached balance');
    return cached.balance;
  }

  console.log('Fetching fresh balance');
  const balance = await flutterwave.api.wallets.balance(currency);

  balanceCache.set(currency, {
    balance,
    timestamp: Date.now(),
    currency,
  });

  return balance;
}
```

### 2. Handle Rate Limiting

```typescript
async function getBalanceWithRetry(
  currency: string,
  maxRetries: number = 3,
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await flutterwave.api.wallets.balance(currency);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt} in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

### 3. Log All Balance Checks

```typescript
interface BalanceLog {
  timestamp: Date;
  currency: string;
  balance: number;
  operation: string;
}

const balanceLogs: BalanceLog[] = [];

async function loggedBalanceCheck(currency: string, operation: string) {
  const balance = await flutterwave.api.wallets.balance(currency);

  balanceLogs.push({
    timestamp: new Date(),
    currency,
    balance: balance.available_balance,
    operation,
  });

  return balance;
}

// Usage
await loggedBalanceCheck('NGN', 'pre-transfer-check');
// Perform transfer
await loggedBalanceCheck('NGN', 'post-transfer-check');
```

### 4. Validate Currency Codes

```typescript
const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'GHS', 'KES', 'ZAR', 'TZS', 'UGX'];

function validateCurrency(currency: string): void {
  if (!SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
    throw new Error(
      `Unsupported currency: ${currency}. Supported: ${SUPPORTED_CURRENCIES.join(', ')}`,
    );
  }
}

// Usage
try {
  validateCurrency('NGN');
  const balance = await flutterwave.api.wallets.balance('NGN');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Real-Time Balance Tracking

### Create Balance Dashboard

```typescript
interface BalanceDashboard {
  totalInNGN: number;
  balances: Array<{
    currency: string;
    available: number;
    total: number;
  }>;
  lastUpdated: Date;
}

async function createBalanceDashboard(): Promise<BalanceDashboard> {
  const balances = await flutterwave.api.wallets.balances();

  // Convert all to NGN for total (using exchange rates)
  const totalInNGN = balances.reduce((sum, balance) => {
    // In a real app, apply exchange rates
    const rate = getExchangeRate(balance.currency, 'NGN');
    return sum + balance.available_balance * rate;
  }, 0);

  return {
    totalInNGN,
    balances: balances.map((b) => ({
      currency: b.currency,
      available: b.available_balance,
      total: b.total_balance,
    })),
    lastUpdated: new Date(),
  };
}

function getExchangeRate(from: string, to: string): number {
  // Placeholder - implement actual exchange rate lookup
  return from === to ? 1 : 1;
}

// Usage
const dashboard = await createBalanceDashboard();
console.log('Total Balance (NGN):', dashboard.totalInNGN);
dashboard.balances.forEach((b) => {
  console.log(`${b.currency}: ${b.available}`);
});
```

## Related

- [Wallets API](/api/wallets) - Complete API reference
- [Transfers API](/api/transfers) - Transfer funds
- [Direct Transfers](/examples/direct-transfers) - Transfer examples
- [Error Handling](/guide/error-handling) - Handle errors gracefully
