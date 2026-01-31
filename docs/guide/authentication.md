# Authentication

The Flutterwave SDK uses OAuth 2.0 client credentials flow for authentication. This guide covers how authentication works, how to manage access tokens, and best practices for secure authentication.

## How It Works

The SDK handles authentication automatically when you initialize it with your credentials:

1. You provide your client ID and client secret
2. The SDK requests an access token from Flutterwave
3. The access token is used for all subsequent API calls
4. The SDK automatically refreshes the token when it expires

## Basic Authentication

### Initialization

```typescript
import { Flutterwave } from 'flutterwave-node-v4';

const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: 'sandbox', // or 'live'
});
```

### Automatic Token Generation

When you make your first API call, the SDK automatically generates an access token:

```typescript
// This will automatically generate a token if needed
const banks = await flutterwave.api.banks.list('NG');
```

### Manual Token Generation

You can manually generate a token:

```typescript
await flutterwave.generateAccessToken();

console.log('Authentication successful');
```

## Access Token Management

### Getting Current Token

```typescript
const token = flutterwave.getAccessToken();

if (token) {
  console.log('Current token:', token);
} else {
  console.log('No token available');
}
```

### Checking Token Validity

The SDK automatically checks if a token is expired before making API calls. If expired, it refreshes the token automatically.

### Token Lifecycle

Access tokens have a limited lifetime (typically 1 hour). The SDK handles token refresh automatically:

```typescript
// First call - generates new token
await flutterwave.api.banks.list('NG');

// Subsequent calls - uses existing token
await flutterwave.api.wallets.balance('NGN');

// If token expires, SDK automatically refreshes it
await flutterwave.api.transfers.list();
```

## Environment Configuration

### Sandbox Environment

Use sandbox for testing:

```typescript
const flutterwave = new Flutterwave({
  clientId: process.env.SANDBOX_CLIENT_ID!,
  clientSecret: process.env.SANDBOX_CLIENT_SECRET!,
  environment: 'sandbox',
});
```

### Live Environment

Use live for production:

```typescript
const flutterwave = new Flutterwave({
  clientId: process.env.LIVE_CLIENT_ID!,
  clientSecret: process.env.LIVE_CLIENT_SECRET!,
  environment: 'live',
});
```

### Environment Variables

Store credentials securely in environment variables:

```bash
# .env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ENCRYPTION_KEY=your_encryption_key
ENVIRONMENT=sandbox
```

```typescript
import dotenv from 'dotenv';
dotenv.config();

const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY,
  environment: process.env.ENVIRONMENT as 'sandbox' | 'live',
});
```

## Encryption Key

The encryption key is required for certain operations like card payments:

```typescript
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY!, // Required for card operations
  environment: 'sandbox',
});
```

## Obtaining Credentials

### From Flutterwave Dashboard

1. Log in to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → API Keys
3. Copy your credentials:
   - Client ID
   - Client Secret
   - Encryption Key (for card operations)

### Sandbox vs Live Credentials

You'll have different credentials for sandbox and live environments:

```typescript
const config = {
  sandbox: {
    clientId: process.env.SANDBOX_CLIENT_ID!,
    clientSecret: process.env.SANDBOX_CLIENT_SECRET!,
    encryptionKey: process.env.SANDBOX_ENCRYPTION_KEY,
  },
  live: {
    clientId: process.env.LIVE_CLIENT_ID!,
    clientSecret: process.env.LIVE_CLIENT_SECRET!,
    encryptionKey: process.env.LIVE_ENCRYPTION_KEY,
  },
};

const env = process.env.NODE_ENV === 'production' ? 'live' : 'sandbox';

const flutterwave = new Flutterwave({
  ...config[env],
  environment: env,
});
```

## Error Handling

### Authentication Failures

Handle authentication errors gracefully:

```typescript
import { UnauthorizedRequestException } from 'flutterwave-node-v4';

try {
  await flutterwave.generateAccessToken();
  console.log('Authentication successful');
} catch (error) {
  if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed. Please check your credentials.');
    console.error('Error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Invalid Credentials

```typescript
async function authenticateWithRetry(
  maxAttempts: number = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await flutterwave.generateAccessToken();
      console.log('Authentication successful');
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedRequestException) {
        console.error(`Authentication attempt ${attempt} failed`);

        if (attempt === maxAttempts) {
          console.error('All authentication attempts failed');
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error;
      }
    }
  }

  return false;
}
```

## Security Best Practices

### 1. Never Hardcode Credentials

```typescript
// Bad - Never do this
const flutterwave = new Flutterwave({
  clientId: 'my_client_id',
  clientSecret: 'my_client_secret',
  environment: 'live',
});

// Good - Use environment variables
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: process.env.ENVIRONMENT as 'sandbox' | 'live',
});
```

### 2. Use .gitignore

Ensure credentials are never committed:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 3. Separate Credentials by Environment

```typescript
// config/flutterwave.ts
const getConfig = () => {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    return {
      clientId: process.env.LIVE_CLIENT_ID!,
      clientSecret: process.env.LIVE_CLIENT_SECRET!,
      environment: 'live' as const,
    };
  }

  return {
    clientId: process.env.SANDBOX_CLIENT_ID!,
    clientSecret: process.env.SANDBOX_CLIENT_SECRET!,
    environment: 'sandbox' as const,
  };
};

export const flutterwave = new Flutterwave(getConfig());
```

### 4. Rotate Credentials Regularly

Implement credential rotation:

```typescript
class FlutterwaveManager {
  private flutterwave: Flutterwave;

  constructor() {
    this.flutterwave = this.createInstance();
  }

  private createInstance(): Flutterwave {
    return new Flutterwave({
      clientId: this.getClientId(),
      clientSecret: this.getClientSecret(),
      environment: this.getEnvironment(),
    });
  }

  private getClientId(): string {
    // Load from secure storage or secrets manager
    return process.env.CLIENT_ID!;
  }

  private getClientSecret(): string {
    // Load from secure storage or secrets manager
    return process.env.CLIENT_SECRET!;
  }

  private getEnvironment(): 'sandbox' | 'live' {
    return process.env.ENVIRONMENT as 'sandbox' | 'live';
  }

  async rotateCredentials(
    newClientId: string,
    newClientSecret: string,
  ): Promise<void> {
    // Update credentials in secure storage
    process.env.CLIENT_ID = newClientId;
    process.env.CLIENT_SECRET = newClientSecret;

    // Recreate instance with new credentials
    this.flutterwave = this.createInstance();

    // Test new credentials
    await this.flutterwave.generateAccessToken();
  }

  getClient(): Flutterwave {
    return this.flutterwave;
  }
}

export const flutterwaveManager = new FlutterwaveManager();
```

### 5. Monitor Authentication

Track authentication events for security:

```typescript
interface AuthEvent {
  timestamp: string;
  success: boolean;
  environment: string;
  error?: string;
}

const authEvents: AuthEvent[] = [];

async function authenticateWithMonitoring(): Promise<void> {
  const event: AuthEvent = {
    timestamp: new Date().toISOString(),
    success: false,
    environment: process.env.ENVIRONMENT || 'unknown',
  };

  try {
    await flutterwave.generateAccessToken();
    event.success = true;
    console.log('Authentication successful');
  } catch (error) {
    event.success = false;
    event.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('Authentication failed:', error);
    throw error;
  } finally {
    authEvents.push(event);

    // Alert on repeated failures
    const recentFailures = authEvents
      .slice(-5)
      .filter((e) => !e.success).length;

    if (recentFailures >= 3) {
      console.warn('Multiple authentication failures detected!');
      // Send alert to monitoring service
    }
  }
}
```

### 6. Use Secrets Management

For production, use a secrets management service:

```typescript
// Example with AWS Secrets Manager
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

async function getCredentialsFromSecretsManager(): Promise<{
  clientId: string;
  clientSecret: string;
}> {
  const client = new SecretsManagerClient({ region: 'us-east-1' });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: 'flutterwave/credentials',
    }),
  );

  const secret = JSON.parse(response.SecretString!);

  return {
    clientId: secret.clientId,
    clientSecret: secret.clientSecret,
  };
}

// Use in initialization
async function initializeFlutterwave(): Promise<Flutterwave> {
  const credentials = await getCredentialsFromSecretsManager();

  return new Flutterwave({
    ...credentials,
    environment: 'live',
  });
}
```

## Testing Authentication

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { Flutterwave, UnauthorizedRequestException } from 'flutterwave-node-v4';

describe('Authentication', () => {
  it('should authenticate with valid credentials', async () => {
    const flutterwave = new Flutterwave({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      environment: 'sandbox',
    });

    await expect(flutterwave.generateAccessToken()).resolves.not.toThrow();
  });

  it('should fail with invalid credentials', async () => {
    const flutterwave = new Flutterwave({
      clientId: 'invalid_id',
      clientSecret: 'invalid_secret',
      environment: 'sandbox',
    });

    await expect(flutterwave.generateAccessToken()).rejects.toThrow(
      UnauthorizedRequestException,
    );
  });
});
```

### Integration Tests

```typescript
describe('Authentication Integration', () => {
  it('should handle token expiry', async () => {
    const flutterwave = new Flutterwave({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      environment: 'sandbox',
    });

    // First call - generates token
    const banks1 = await flutterwave.api.banks.list('NG');
    expect(banks1.status).toBe('success');

    // Second call - uses cached token
    const banks2 = await flutterwave.api.banks.list('NG');
    expect(banks2.status).toBe('success');

    // Token should be reused
    expect(flutterwave.getAccessToken()).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues

#### Invalid Client Credentials

```
Error: Authentication failed
Solution: Verify your client ID and client secret are correct
```

#### Wrong Environment

```
Error: API calls failing in production
Solution: Ensure you're using live credentials with environment: 'live'
```

#### Missing Encryption Key

```
Error: Encryption key required for card operations
Solution: Add encryptionKey to your configuration
```

#### Token Expired

```
Error: Token expired
Solution: The SDK handles this automatically, but you can manually call:
await flutterwave.generateAccessToken();
```

## Related

- [Getting Started](/guide/getting-started) - Basic SDK setup
- [Configuration](/guide/configuration) - Detailed configuration options
- [Error Handling](/guide/error-handling) - Handle authentication errors
- [TypeScript Support](/guide/typescript) - Type-safe authentication
