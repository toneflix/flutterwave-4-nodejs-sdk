# TypeScript Support

The Flutterwave SDK is written entirely in TypeScript and provides comprehensive type definitions for all APIs, request parameters, and response objects. This ensures type safety and excellent IDE autocomplete support.

## Type Definitions

### Core Types

All major SDK components are fully typed:

```typescript
import {
  Flutterwave,
  InitOptions,
  FlutterwaveAuthResponse,
} from 'flutterwave-node-v4';

const options: InitOptions = {
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key',
  environment: 'sandbox',
};

const flutterwave = new Flutterwave(options);
```

### API Response Types

All API responses are typed, giving you autocomplete and type checking:

```typescript
import { FlutterwaveResponse } from 'flutterwave-node-v4';

// The response type is automatically inferred
const banks = await flutterwave.api.banks.list('NG');
// banks has type: FlutterwaveResponse<Bank[]>

// Access response properties with autocomplete
console.log(banks.status); // 'success' | 'error'
console.log(banks.message); // string
console.log(banks.data); // Bank[]
```

### Payment Types

The SDK exports comprehensive payment-related types:

```typescript
import {
  Authorization,
  OtpAuthorization,
  PinAuthorization,
  External3DsAuthorization,
  AvsAuthorization,
  CardDetails,
  EncryptedCardDetails,
  PaymentMethodType,
  FeeDetails,
  BillingDetails,
} from 'flutterwave-node-v4';

// Card details with type safety
const cardDetails: CardDetails = {
  number: '5531886652142950',
  cvv: '564',
  expiry_month: '09',
  expiry_year: '32',
};

// Authorization type with discriminated union
const otpAuth: OtpAuthorization = {
  type: 'otp',
  otp: '123456',
};

const pinAuth: PinAuthorization = {
  type: 'pin',
  pin: '3310',
};
```

### Transfer Types

Transfer-related types are fully defined:

```typescript
interface DirectTransferPayload {
  action: 'instant' | 'scheduled';
  type: 'bank' | 'wallet' | 'mobile_money';
  reference: string;
  payment_instruction: {
    source_currency: string;
    destination_currency: string;
    amount: {
      value: number;
      applies_to: 'source_currency' | 'destination_currency';
    };
    recipient: {
      bank?: {
        account_number: string;
        code: string;
      };
      wallet?: {
        id: string;
      };
      mobile_money?: {
        number: string;
        network: string;
      };
    };
    sender: {
      name: {
        first: string;
        last: string;
      };
    };
  };
}

const transfer: DirectTransferPayload = {
  action: 'instant',
  type: 'bank',
  reference: `ref-${Date.now()}`,
  payment_instruction: {
    source_currency: 'NGN',
    destination_currency: 'NGN',
    amount: {
      value: 10000,
      applies_to: 'source_currency',
    },
    recipient: {
      bank: {
        account_number: '0690000031',
        code: '044',
      },
    },
    sender: {
      name: {
        first: 'John',
        last: 'Doe',
      },
    },
  },
};
```

### Virtual Account Types

```typescript
interface VirtualAccountPayload {
  type: 'static' | 'dynamic';
  reference: string;
  customer: {
    name: {
      first: string;
      last: string;
    };
    email: string;
    phone_number?: string;
  };
  currency: string;
}

const virtualAccount: VirtualAccountPayload = {
  type: 'static',
  reference: `va-${Date.now()}`,
  customer: {
    name: {
      first: 'John',
      last: 'Doe',
    },
    email: 'john@example.com',
  },
  currency: 'NGN',
};
```

## Interface Exports

The SDK exports many useful interfaces and types:

```typescript
import {
  // Core interfaces
  IAddress,
  IPersonName,
  IPhoneNumber,
  XGenericObject,

  // Payment method types
  PaymentMethodType,
  IPmCard,

  // API response
  FlutterwaveResponse,

  // Exception types
  HttpException,
  BadRequestException,
  UnauthorizedRequestException,
  ForbiddenRequestException,
} from 'flutterwave-node-v4';
```

## Generic Types

### Address Interface

```typescript
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

const billingAddress: IAddress = {
  street: '123 Main St',
  city: 'Lagos',
  state: 'Lagos',
  country: 'NG',
  postal_code: '100001',
};
```

### Person Name Interface

```typescript
interface IPersonName {
  first: string;
  last: string;
  middle?: string;
}

const customerName: IPersonName = {
  first: 'John',
  last: 'Doe',
  middle: 'Smith',
};
```

### Phone Number Interface

```typescript
interface IPhoneNumber {
  country_code: string;
  number: string;
}

const phone: IPhoneNumber = {
  country_code: '+234',
  number: '8012345678',
};
```

## Type Guards

Use TypeScript type guards for safer code:

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
} from 'flutterwave-node-v4';

async function safeTransfer(data: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(data);
  } catch (error) {
    // Type guard for exception handling
    if (error instanceof BadRequestException) {
      console.error('Invalid data:', error.message);
      throw new Error('Please check your transfer details');
    } else if (error instanceof UnauthorizedRequestException) {
      console.error('Authentication failed:', error.message);
      throw new Error('Authentication error');
    } else {
      throw error;
    }
  }
}
```

## Discriminated Unions

The SDK uses discriminated unions for type safety:

```typescript
// Authorization is a discriminated union
type Authorization =
  | OtpAuthorization
  | PinAuthorization
  | External3DsAuthorization
  | AvsAuthorization;

function handleAuthorization(auth: Authorization) {
  // TypeScript knows which properties are available based on type
  switch (auth.type) {
    case 'otp':
      console.log('OTP:', auth.otp); // TypeScript knows auth.otp exists
      break;
    case 'pin':
      console.log('PIN:', auth.pin); // TypeScript knows auth.pin exists
      break;
    case 'external_3ds':
      console.log('Redirect URL:', auth.redirect_url);
      break;
    case 'avs':
      console.log('Address:', auth.address);
      break;
  }
}
```

## Generic Response Type

The `FlutterwaveResponse<T>` type is generic:

```typescript
import { FlutterwaveResponse } from 'flutterwave-node-v4';

// Response with array data
type BanksResponse = FlutterwaveResponse<Bank[]>;

// Response with single object
type TransferResponse = FlutterwaveResponse<Transfer>;

// Custom response type
interface CustomData {
  id: string;
  name: string;
}

type CustomResponse = FlutterwaveResponse<CustomData>;
```

## Type Inference

TypeScript automatically infers return types:

```typescript
// TypeScript infers the return type automatically
const banks = await flutterwave.api.banks.list('NG');
// Type: FlutterwaveResponse<Bank[]>

const transfer = await flutterwave.api.transfers.directTransfer(data);
// Type: FlutterwaveResponse<Transfer>

const walletBalance = await flutterwave.api.wallets.balance('NGN');
// Type: FlutterwaveResponse<WalletBalance>
```

## Strict Null Checks

The SDK is compatible with strict null checks:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

```typescript
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!, // Use ! or handle undefined
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY, // Optional
  environment: 'sandbox',
});
```

## Type Assertions

Use type assertions when needed:

```typescript
// When you know more about the type than TypeScript
const customData = response.data as CustomType;

// Or use angle-bracket syntax
const customData = <CustomType>response.data;
```

## Utility Types

Combine SDK types with TypeScript utility types:

```typescript
// Make all properties optional
type PartialTransfer = Partial<DirectTransferPayload>;

// Pick specific properties
type TransferBasic = Pick<DirectTransferPayload, 'reference' | 'type'>;

// Omit properties
type TransferWithoutAction = Omit<DirectTransferPayload, 'action'>;

// Make properties readonly
type ReadonlyTransfer = Readonly<DirectTransferPayload>;
```

## Custom Type Extensions

Extend SDK types for your application:

```typescript
import { FlutterwaveResponse } from 'flutterwave-node-v4';

// Add custom metadata
interface ExtendedTransfer extends Transfer {
  metadata: {
    orderId: string;
    customerId: string;
    notes?: string;
  };
}

// Custom response wrapper
interface AppResponse<T> extends FlutterwaveResponse<T> {
  timestamp: number;
  requestId: string;
}
```

## IDE Support

### VSCode Autocomplete

The SDK provides excellent autocomplete support:

```typescript
const flutterwave = new Flutterwave(options);

// Autocomplete shows all available APIs
flutterwave.api// Autocomplete shows all available methods // banks, transfers, virtualAccounts, etc.
.flutterwave.api.banks// Autocomplete shows all parameter properties // list(), branches(), resolve()
.flutterwave.api.banks
  .resolve({
    account: {
      // Autocomplete shows: code, number
    },
    // Autocomplete shows: currency
  });
```

### Inline Documentation

Hover over methods and types to see inline documentation:

```typescript
// Hover over 'list' to see documentation
flutterwave.api.banks.list('NG');

// Hover over 'directTransfer' to see parameters
flutterwave.api.transfers.directTransfer({...});
```

## Type-Safe Configuration

Create type-safe configuration objects:

```typescript
interface Config {
  flutterwave: InitOptions;
  webhook: {
    secretHash: string;
    endpoint: string;
  };
}

const config: Config = {
  flutterwave: {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    environment: 'sandbox',
  },
  webhook: {
    secretHash: process.env.SECRET_HASH!,
    endpoint: '/webhook',
  },
};

const flutterwave = new Flutterwave(config.flutterwave);
```

## Type-Safe Error Handling

```typescript
import { HttpException, BadRequestException } from 'flutterwave-node-v4';

function isFlutterwaveError(error: unknown): error is HttpException {
  return error instanceof HttpException;
}

async function transferWithTypeGuard(data: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(data);
  } catch (error) {
    if (isFlutterwaveError(error)) {
      console.error('Flutterwave error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

## Best Practices

### 1. Enable Strict Mode

Use TypeScript strict mode for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. Avoid `any` Type

Use proper types instead of `any`:

```typescript
// Bad
const transfer: any = await flutterwave.api.transfers.directTransfer(data);

// Good
const transfer = await flutterwave.api.transfers.directTransfer(data);
// Type is automatically inferred
```

### 3. Use Type Annotations for Function Parameters

```typescript
import { DirectTransferPayload } from './types';

// Annotate function parameters
async function createTransfer(
  data: DirectTransferPayload,
): Promise<FlutterwaveResponse<Transfer>> {
  return await flutterwave.api.transfers.directTransfer(data);
}
```

### 4. Leverage Union Types

```typescript
type TransferType = 'bank' | 'wallet' | 'mobile_money';
type TransferAction = 'instant' | 'scheduled';

interface TransferConfig {
  type: TransferType;
  action: TransferAction;
}

const config: TransferConfig = {
  type: 'bank', // Only accepts valid values
  action: 'instant',
};
```

### 5. Use Interface Composition

```typescript
interface BaseTransfer {
  reference: string;
  type: TransferType;
}

interface InstantTransfer extends BaseTransfer {
  action: 'instant';
}

interface ScheduledTransfer extends BaseTransfer {
  action: 'scheduled';
  scheduled_date: string;
}

type Transfer = InstantTransfer | ScheduledTransfer;
```

## Type Declaration Files

If you need to extend or modify types, create declaration files:

```typescript
// types/flutterwave.d.ts
import { FlutterwaveResponse } from 'flutterwave-node-v4';

declare module 'flutterwave-node-v4' {
  interface CustomData {
    customField: string;
  }

  export interface ExtendedResponse<T> extends FlutterwaveResponse<T> {
    custom: CustomData;
  }
}
```

## Testing with Types

Use types in your tests:

```typescript
import { describe, it, expect } from 'vitest';
import { Flutterwave, FlutterwaveResponse } from 'flutterwave-node-v4';

describe('Transfer Tests', () => {
  it('should create transfer with correct types', async () => {
    const response = await flutterwave.api.transfers.directTransfer(data);

    // TypeScript knows the response shape
    expect(response.status).toBe('success');
    expect(response.data).toBeDefined();
    expect(typeof response.data.id).toBe('string');
  });
});
```

## Related

- [Getting Started](/guide/getting-started) - SDK setup and basic usage
- [Configuration](/guide/configuration) - Configuration options
- [Error Handling](/guide/error-handling) - Type-safe error handling
- [API Reference](/api/overview) - Complete API documentation
