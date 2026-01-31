# Configuration

Learn how to configure the Flutterwave SDK for different environments and use cases.

## Basic Configuration

The SDK can be configured in two ways: using environment variables or passing configuration options directly.

### Using Environment Variables

The SDK automatically reads from these environment variables:

```bash
FLUTTERWAVE_PUBLIC_KEY=your_public_key
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_encryption_key
FLUTTERWAVE_ENVIRONMENT=sandbox # or 'production'
```

Then initialize without parameters:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave();
```

### Passing Configuration Directly

Alternatively, pass configuration options directly:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'PHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Latxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
  environment: 'sandbox', // 'sandbox' or 'production'
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

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
CLIENT_ID=your_test_client_id
CLIENT_SECRET=your_test_client_secret
ENCRYPTION_KEY=your_test_encryption_key
```

### Production Environment

```bash
# .env.production
CLIENT_ID=your_production_client_id
CLIENT_SECRET=your_production_client_secret
ENCRYPTION_KEY=your_production_encryption_key
```

## Advanced Configuration

### Multiple Instances

You can create multiple SDK instances with different configurations:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

// Sandbox instance for testing
const sandboxClient = new Flutterwave({
  publicKey: process.env.SANDBOX_PUBLIC_KEY!,
  secretKey: process.env.SANDBOX_SECRET_KEY!,
  encryptionKey: process.env.SANDBOX_ENCRYPTION_KEY!,
  environment: 'sandbox',
});

// Production instance for live transactions
const productionClient = new Flutterwave({
  publicKey: process.env.PRODUCTION_PUBLIC_KEY!,
  secretKey: process.env.PRODUCTION_SECRET_KEY!,
  encryptionKey: process.env.PRODUCTION_ENCRYPTION_KEY!,
  environment: 'production',
});

// Use the appropriate client based on your needs
const client =
  process.env.NODE_ENV === 'production' ? productionClient : sandboxClient;
```

### Configuration Factory

Create a configuration factory for cleaner code:

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

function createFlutterwaveClient(environment: 'sandbox' | 'production') {
  const config = {
    sandbox: {
      publicKey: process.env.SANDBOX_PUBLIC_KEY!,
      secretKey: process.env.SANDBOX_SECRET_KEY!,
      encryptionKey: process.env.SANDBOX_ENCRYPTION_KEY!,
      environment: 'sandbox' as const,
    },
    production: {
      publicKey: process.env.PRODUCTION_PUBLIC_KEY!,
      secretKey: process.env.PRODUCTION_SECRET_KEY!,
      encryptionKey: process.env.PRODUCTION_ENCRYPTION_KEY!,
      environment: 'production' as const,
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
    publicKey: '', // Invalid: empty string
    secretKey: '', // Invalid: empty string
    encryptionKey: '', // Invalid: empty string
  });
} catch (error) {
  console.error('Configuration error:', error.message);
  // Configuration error: Public key is required
}
```

## Best Practices

### 1. Use Environment Variables

Store credentials in environment variables, not in your code:

```typescript
// ❌ Bad: Hardcoded credentials
const flutterwave = new Flutterwave({
  publicKey: 'FLWPUBK-xxxxxxxxxxxxx',
  secretKey: 'FLWSECK-xxxxxxxxxxxxx',
  encryptionKey: 'FLWSECK_TESTxxxxxxxxx',
});

// ✅ Good: From environment variables
const flutterwave = new Flutterwave({
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY!,
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY!,
});
```

### 2. Separate Sandbox and Production

Keep sandbox and production credentials completely separate:

```typescript
// ✅ Good: Clear separation
const config = {
  publicKey:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_PUBLIC_KEY!
      : process.env.SANDBOX_PUBLIC_KEY!,
  secretKey:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_SECRET_KEY!
      : process.env.SANDBOX_SECRET_KEY!,
  encryptionKey:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_ENCRYPTION_KEY!
      : process.env.SANDBOX_ENCRYPTION_KEY!,
  environment:
    process.env.NODE_ENV === 'production'
      ? ('production' as const)
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
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  environment: 'sandbox' | 'production';
}

function getConfig(): FlutterwaveConfig {
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const encryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;

  if (!publicKey || !secretKey || !encryptionKey) {
    throw new Error('Missing required Flutterwave credentials');
  }

  return {
    publicKey,
    secretKey,
    encryptionKey,
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  };
}

const flutterwave = new Flutterwave(getConfig());
```

## Next Steps

- Learn about [Authentication](/guide/authentication)
- Understand [Error Handling](/guide/error-handling)
- Explore the [API Reference](/api/overview)
