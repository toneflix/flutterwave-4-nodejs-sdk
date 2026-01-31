# Banks API

The Banks API provides methods to list banks, get bank branches, and resolve account details.

## Methods

### list()

Get a list of banks in a specific country.

```typescript
async list(country: CountryCode): Promise<IBank[]>
```

#### Parameters

- `country` - Two-letter country code (e.g., 'NG', 'GH', 'KE')

#### Example

```typescript
const banks = await flutterwave.api.banks.list('NG');

banks.forEach((bank) => {
  console.log(`${bank.name} - ${bank.code}`);
});
```

#### Response

```typescript
interface IBank {
  id: string;
  code: string;
  name: string;
}
```

### branches()

Get branches for a specific bank.

```typescript
async branches(bankId: string): Promise<IBankBranch[]>
```

#### Parameters

- `bankId` - The bank ID

#### Example

```typescript
const branches = await flutterwave.api.banks.branches('190');

branches.forEach((branch) => {
  console.log(`${branch.branch_name} - ${branch.branch_code}`);
});
```

### resolve()

Resolve and verify bank account details. The method signature varies based on the currency being resolved.

```typescript
async resolve(data: IBankAccountResolveForm): Promise<IBankAccountResolved>
```

#### NGN Account Resolution

```typescript
const response = await flutterwave.api.banks.resolve({
  account: {
    code: '044',
    number: '0690000031',
  },
  currency: 'NGN',
});

console.log('Account Name:', response.account_name);
```

#### USD Account Resolution

Requires country in addition to bank code and account number:

```typescript
const response = await flutterwave.api.banks.resolve({
  account: {
    country: 'NG',
    code: '101',
    number: '1234567890',
  },
  currency: 'USD',
});

console.log('Account Name:', response.account_name);
console.log('Account Number:', response.account_number);
```

#### GBP Account Resolution - Individual

For individual accounts in GBP:

```typescript
const response = await flutterwave.api.banks.resolve({
  account: {
    type: 'individual',
    code: '044',
    number: '12345678',
    name: {
      first: 'John',
      last: 'Doe',
    },
  },
  currency: 'GBP',
});

console.log('Account Name:', response.account_name);
```

#### GBP Account Resolution - Corporate

For corporate accounts in GBP:

```typescript
const response = await flutterwave.api.banks.resolve({
  account: {
    type: 'corporate',
    code: '04',
    number: '12345678',
    business_name: 'Acme Corp',
  },
  currency: 'GBP',
});

console.log('Account Name:', response.account_name);
```

## Type Definitions

### IBankAccountResolveForm

The form structure varies by currency:

```typescript
type IBankAccountResolveForm =
  | IBankAccountResolveNGN
  | IBankAccountResolveUSD
  | IBankAccountResolveGBP;

interface IBankAccountResolveNGN {
  currency: 'NGN';
  account: {
    code: string;
    number: string;
  };
}

interface IBankAccountResolveUSD {
  currency: 'USD';
  account: {
    country: string;
    code: string;
    number: string;
  };
}

interface IBankAccountResolveGBP {
  currency: 'GBP';
  account:
    | {
        type: 'individual';
        code: string;
        number: string;
        name: {
          first: string;
          last: string;
        };
      }
    | {
        type: 'corporate';
        code: string;
        number: string;
        business_name: string;
      };
}
```

### IBankAccountResolved

```typescript
interface IBankAccountResolved {
  account_number: string;
  account_name: string;
}
```

## Error Handling

Account resolution may fail if:

- Invalid bank code
- Account number doesn't exist
- Account name mismatch (for GBP accounts)
- Invalid country code

```typescript
try {
  const account = await flutterwave.api.banks.resolve({
    account: { code: '044', number: '0690000031' },
    currency: 'NGN',
  });
  console.log('Valid account:', account.account_name);
} catch (error) {
  console.error('Account resolution failed:', error.message);
}
```

## Best Practices

### 1. Cache Bank Lists

Bank lists don't change frequently. Cache them to reduce API calls:

```typescript
let cachedBanks: IBank[] | null = null;

async function getBanks(country: string): Promise<IBank[]> {
  if (!cachedBanks) {
    cachedBanks = await flutterwave.api.banks.list(country);
  }
  return cachedBanks;
}
```

### 2. Validate Before Transfers

Always resolve accounts before initiating transfers:

```typescript
async function validateAndTransfer(accountNumber: string, bankCode: string) {
  // First, validate the account
  const resolved = await flutterwave.api.banks.resolve({
    account: { code: bankCode, number: accountNumber },
    currency: 'NGN',
  });

  console.log(`Transferring to: ${resolved.account_name}`);

  // Then proceed with transfer
  const transfer = await flutterwave.api.transfers.directTransfer({
    // ... transfer data
  });
}
```

### 3. Handle Account Resolution Errors Gracefully

```typescript
async function safeResolveAccount(accountNumber: string, bankCode: string) {
  try {
    return await flutterwave.api.banks.resolve({
      account: { code: bankCode, number: accountNumber },
      currency: 'NGN',
    });
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw new Error('Invalid account details. Please check and try again.');
    }
    throw error;
  }
}
```

## Related APIs

- [Transfers](/api/transfers) - Send money to resolved accounts
- [Transfer Recipients](/api/transfer-recipients) - Store validated account details
