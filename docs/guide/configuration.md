# Configuration

Learn how to configure the Flutterwave SDK for different environments and use cases.

## Basic Configuration

The SDK can be configured in multiple ways: using environment variables, individual parameters, or an options object.

### Using Environment Variables

The SDK automatically reads from these environment variables:

```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ENCRYPTION_KEY=your_encryption_key
ENVIRONMENT=sandbox  # or 'live'
```

Then initialize without parameters:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave();
```

### Using Individual Parameters

Pass credentials as individual parameters:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave(
  'your_client_id',
  'your_client_secret',
  'your_encryption_key', // optional
  'sandbox', // optional: 'sandbox' or 'live'
);
```

### Using Options Object

Alternatively, pass configuration as an object:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key', // optional
  environment: 'sandbox', // optional: 'sandbox' or 'live'
});
```

## Configuration Options

### clientId

- **Type**: `string`
- **Required**: Yes
- **Environment Variable**: `CLIENT_ID`
- **Description**: Your Flutterwave client ID

Used for authenticating API requests.

### clientSecret

- **Type**: `string`
- **Required**: Yes
- **Environment Variable**: `CLIENT_SECRET`
- **Description**: Your Flutterwave client secret

Used for server-side authentication. Keep this secure and never expose it in client-side code.

### encryptionKey

- **Type**: `string`
- **Required**: No
- **Environment Variable**: `ENCRYPTION_KEY`
- **Description**: Your Flutterwave encryption key

Used for encrypting sensitive data like card details in API requests.

### environment

- **Type**: `'sandbox' | 'live'`
- **Default**: `'live'`
- **Environment Variable**: `ENVIRONMENT`
- **Description**: The environment to use

- `sandbox`: For testing and development (uses `developersandbox-api.flutterwave.com`)
- `live`: For production transactions (uses `api.flutterwave.com`)

::: warning
Always use the sandbox environment during development and testing. Switch to live only when you're ready to process real transactions.
:::

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
CLIENT_ID=your_test_client_id
CLIENT_SECRET=your_test_client_secret
ENCRYPTION_KEY=your_test_encryption_key
ENVIRONMENT=sandbox
```

### Production Environment

```bash
# .env.production
CLIENT_ID=your_production_client_id
CLIENT_SECRET=your_production_client_secret
ENCRYPTION_KEY=your_production_encryption_key
ENVIRONMENT=live
```

## Advanced Configuration

### Multiple Instances

You can create multiple SDK instances with different configurations:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

// Sandbox instance for testing
const sandboxClient = new Flutterwave({
  clientId: process.env.SANDBOX_CLIENT_ID!,
  clientSecret: process.env.SANDBOX_CLIENT_SECRET!,
  encryptionKey: process.env.SANDBOX_ENCRYPTION_KEY,
  environment: 'sandbox',
});

// Production instance for live transactions
const productionClient = new Flutterwave({
  clientId: process.env.PRODUCTION_CLIENT_ID!,
  clientSecret: process.env.PRODUCTION_CLIENT_SECRET!,
  encryptionKey: process.env.PRODUCTION_ENCRYPTION_KEY,
  environment: 'live',
});

// Use the appropriate client based on your needs
const client =
  process.env.NODE_ENV === 'production' ? productionClient : sandboxClient;
```

### Configuration Factory

Create a configuration factory for cleaner code:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

function createFlutterwaveClient(environment: 'sandbox' | 'live') {
  const config = {
    sandbox: {
      clientId: process.env.SANDBOX_CLIENT_ID!,
      clientSecret: process.env.SANDBOX_CLIENT_SECRET!,
      encryptionKey: process.env.SANDBOX_ENCRYPTION_KEY,
      environment: 'sandbox' as const,
    },
    live: {
      clientId: process.env.PRODUCTION_CLIENT_ID!,
      clientSecret: process.env.PRODUCTION_CLIENT_SECRET!,
      encryptionKey: process.env.PRODUCTION_ENCRYPTION_KEY,
      environment: 'live' as const,
    },
  };

  return new Flutterwave(config[environment]);
}

// Usage
const flutterwave = createFlutterwaveClient('sandbox');
```

## Configuration Validation

The SDK validates your configuration on initialization:

```typescript
try {
  const flutterwave = new Flutterwave({
    clientId: '', // Invalid: empty string
    clientSecret: '', // Invalid: empty string
  });
} catch (error) {
  console.error('Configuration error:', error.message);
  // Configuration error: Client ID and Client Secret are required
}
```

## Best Practices

### 1. Use Environment Variables

Store credentials in environment variables, not in your code:

```typescript
// ❌ Bad: Hardcoded credentials
const flutterwave = new Flutterwave({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  encryptionKey: 'your_encryption_key',
});

// ✅ Good: From environment variables
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY,
});
```

### 2. Separate Sandbox and Production

Keep sandbox and production credentials completely separate:

```typescript
// ✅ Good: Clear separation
const config = {
  clientId:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_CLIENT_ID!
      : process.env.SANDBOX_CLIENT_ID!,
  clientSecret:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_CLIENT_SECRET!
      : process.env.SANDBOX_CLIENT_SECRET!,
  encryptionKey:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_ENCRYPTION_KEY
      : process.env.SANDBOX_ENCRYPTION_KEY,
  environment:
    process.env.NODE_ENV === 'production'
      ? ('live' as const)
      : ('sandbox' as const),
};

const flutterwave = new Flutterwave(config);
```

### 3. Never Commit Credentials

Add your `.env` files to `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.development
.env.production
```

### 4. Use Type Safety

Leverage TypeScript for configuration safety:

```typescript
interface FlutterwaveConfig {
  clientId: string;
  clientSecret: string;
  encryptionKey: string;
  environment: 'sandbox' | 'live';
}

function getConfig(): FlutterwaveConfig {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!clientId || !clientSecret || !encryptionKey) {
    throw new Error('Missing required Flutterwave credentials');
  }

  return {
    clientId,
    clientSecret,
    encryptionKey,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  };
}

const flutterwave = new Flutterwave(getConfig());
```

## Next Steps

- Learn about [Authentication](/guide/authentication)
- Understand [Error Handling](/guide/error-handling)
- Explore the [API Reference](/api/overview)
