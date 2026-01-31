# Error Handling

The Flutterwave SDK provides comprehensive error handling with custom exception classes for different HTTP error scenarios. This makes it easy to handle errors gracefully in your application.

## Exception Classes

The SDK includes the following exception classes:

### BadRequestException

Thrown when the API returns a 400 Bad Request status code. This typically indicates invalid request data.

```typescript
import { BadRequestException } from 'flutterwave-node-v4';
```

**Common causes:**

- Invalid parameter values
- Missing required fields
- Malformed request data
- Invalid currency codes or country codes

### UnauthorizedRequestException

Thrown when the API returns a 401 Unauthorized status code. This indicates authentication failure.

```typescript
import { UnauthorizedRequestException } from 'flutterwave-node-v4';
```

**Common causes:**

- Invalid client ID or client secret
- Expired or invalid access token
- Missing encryption key for card operations

### ForbiddenRequestException

Thrown when the API returns a 403 Forbidden status code. This indicates lack of permission for the requested operation.

```typescript
import { ForbiddenRequestException } from 'flutterwave-node-v4';
```

**Common causes:**

- Insufficient account permissions
- Attempting operations not enabled for your account
- IP address restrictions

### HttpException

The base exception class for all HTTP-related errors. Other exceptions extend this class.

```typescript
import { HttpException } from 'flutterwave-node-v4';
```

## Basic Error Handling

### Try-Catch Pattern

The most common way to handle errors is using try-catch blocks:

```typescript
import {
  BadRequestException,
  UnauthorizedRequestException,
} from 'flutterwave-node-v4';

try {
  const transfer = await flutterwave.api.transfers.directTransfer({
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
  });

  console.log('Transfer successful:', transfer.id);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid transfer data:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Error Handling Patterns

### Specific Exception Handling

Handle different exception types with specific recovery strategies:

```typescript
async function createTransferWithErrorHandling(transferData: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(transferData);
  } catch (error) {
    if (error instanceof BadRequestException) {
      // Log invalid data and ask user to correct
      console.error('Invalid data provided:', error.message);
      throw new Error('Please check your transfer details and try again');
    } else if (error instanceof UnauthorizedRequestException) {
      // Attempt to refresh credentials
      console.error('Authentication failed, refreshing token...');
      await flutterwave.generateAccessToken();
      // Retry the request
      return await flutterwave.api.transfers.directTransfer(transferData);
    } else if (error instanceof ForbiddenRequestException) {
      // Log permission issue
      console.error('Operation not permitted:', error.message);
      throw new Error('You do not have permission for this operation');
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}
```

### Retry Logic

Implement retry logic for transient errors:

```typescript
async function transferWithRetry(
  transferData: any,
  maxRetries: number = 3,
): Promise<any> {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await flutterwave.api.transfers.directTransfer(transferData);
    } catch (error) {
      lastError = error;

      if (error instanceof UnauthorizedRequestException) {
        // Refresh token and retry
        await flutterwave.generateAccessToken();
        continue;
      }

      if (error instanceof BadRequestException) {
        // Don't retry bad requests
        throw error;
      }

      // For other errors, wait before retry
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

### Validation Before API Calls

Validate data before making API calls to catch errors early:

```typescript
function validateTransferData(data: any): void {
  if (!data.reference) {
    throw new Error('Reference is required');
  }

  if (!data.payment_instruction) {
    throw new Error('Payment instruction is required');
  }

  if (data.payment_instruction.amount.value <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  // Add more validation as needed
}

async function createTransferSafely(transferData: any) {
  try {
    // Validate first
    validateTransferData(transferData);

    // Then make API call
    return await flutterwave.api.transfers.directTransfer(transferData);
  } catch (error) {
    if (error instanceof Error && !error.message.includes('API')) {
      // This is a validation error
      console.error('Validation failed:', error.message);
      throw error;
    }

    // This is an API error
    handleApiError(error);
  }
}
```

### Custom Error Wrapper

Create a custom error wrapper for consistent error handling:

```typescript
class TransferError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'TransferError';
  }
}

async function safeTransfer(transferData: any): Promise<any> {
  try {
    return await flutterwave.api.transfers.directTransfer(transferData);
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw new TransferError(
        'Invalid transfer details provided',
        'INVALID_DATA',
        error,
      );
    } else if (error instanceof UnauthorizedRequestException) {
      throw new TransferError('Authentication failed', 'AUTH_FAILED', error);
    } else if (error instanceof ForbiddenRequestException) {
      throw new TransferError('Operation not permitted', 'FORBIDDEN', error);
    } else {
      throw new TransferError('Transfer failed', 'UNKNOWN_ERROR', error);
    }
  }
}
```

## Logging Errors

Implement proper error logging for debugging and monitoring:

```typescript
import { HttpException } from 'flutterwave-node-v4';

function logError(error: any, context: string): void {
  const timestamp = new Date().toISOString();

  if (error instanceof HttpException) {
    console.error(`[${timestamp}] ${context}:`, {
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(`[${timestamp}] ${context}:`, {
      message: error.message || 'Unknown error',
      stack: error.stack,
    });
  }
}

async function transferWithLogging(transferData: any) {
  try {
    const result = await flutterwave.api.transfers.directTransfer(transferData);
    console.log('Transfer successful:', result.id);
    return result;
  } catch (error) {
    logError(error, 'Transfer failed');
    throw error;
  }
}
```

## Error Monitoring

Set up error monitoring for production environments:

```typescript
interface ErrorReport {
  timestamp: string;
  errorType: string;
  message: string;
  context: any;
}

const errorReports: ErrorReport[] = [];

function reportError(error: any, context: any): void {
  const report: ErrorReport = {
    timestamp: new Date().toISOString(),
    errorType: error.constructor.name,
    message: error.message,
    context,
  };

  errorReports.push(report);

  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(report);
  }
}

async function monitoredTransfer(transferData: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(transferData);
  } catch (error) {
    reportError(error, {
      operation: 'transfer',
      reference: transferData.reference,
      amount: transferData.payment_instruction.amount.value,
    });
    throw error;
  }
}

function sendToMonitoringService(report: ErrorReport): void {
  // Implementation depends on your monitoring service
  // e.g., Sentry, DataDog, CloudWatch, etc.
}
```

## Best Practices

### 1. Always Handle Errors

Never leave API calls without error handling:

```typescript
// Bad
const transfer = await flutterwave.api.transfers.directTransfer(data);

// Good
try {
  const transfer = await flutterwave.api.transfers.directTransfer(data);
} catch (error) {
  handleError(error);
}
```

### 2. Provide User-Friendly Messages

Don't expose technical error messages to end users:

```typescript
async function createUserFriendlyTransfer(transferData: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(transferData);
  } catch (error) {
    if (error instanceof BadRequestException) {
      return {
        success: false,
        message: 'Please check your transfer details and try again',
      };
    } else if (error instanceof UnauthorizedRequestException) {
      return {
        success: false,
        message: 'Authentication error. Please contact support',
      };
    } else {
      return {
        success: false,
        message: 'Transfer failed. Please try again later',
      };
    }
  }
}
```

### 3. Log Errors for Debugging

Keep detailed logs for debugging in development:

```typescript
async function debugTransfer(transferData: any) {
  try {
    const result = await flutterwave.api.transfers.directTransfer(transferData);

    if (process.env.NODE_ENV === 'development') {
      console.log('Transfer Debug:', {
        id: result.id,
        status: result.status,
        reference: transferData.reference,
      });
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Transfer Error Debug:', {
        error: error.constructor.name,
        message: error.message,
        data: transferData,
      });
    }
    throw error;
  }
}
```

### 4. Don't Swallow Errors

Always propagate or handle errors appropriately:

```typescript
// Bad
async function badTransfer(data: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(data);
  } catch (error) {
    // Silently failing - very bad!
  }
}

// Good
async function goodTransfer(data: any) {
  try {
    return await flutterwave.api.transfers.directTransfer(data);
  } catch (error) {
    logError(error, 'Transfer failed');
    throw error; // Re-throw so caller can handle
  }
}
```

## Common Error Scenarios

### Invalid Credentials

```typescript
try {
  const flutterwave = new Flutterwave('wrong_client_id', 'wrong_client_secret');

  await flutterwave.generateAccessToken();
} catch (error) {
  if (error instanceof UnauthorizedRequestException) {
    console.error('Invalid credentials provided');
  }
}
```

### Insufficient Balance

```typescript
try {
  await flutterwave.api.transfers.directTransfer(largeTransferData);
} catch (error) {
  if (error instanceof BadRequestException) {
    if (error.message.includes('insufficient')) {
      console.error('Insufficient balance for this transfer');
    }
  }
}
```

### Invalid Account Details

```typescript
try {
  await flutterwave.api.banks.resolve({
    account: {
      code: '044',
      number: 'invalid_number',
    },
    currency: 'NGN',
  });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid account number');
  }
}
```

## Testing Error Handling

Write tests to ensure your error handling works correctly:

```typescript
import { describe, it, expect } from 'vitest';

describe('Error Handling', () => {
  it('should handle bad request errors', async () => {
    const invalidData = {
      // Missing required fields
    };

    await expect(
      flutterwave.api.transfers.directTransfer(invalidData as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should handle authentication errors', async () => {
    const badFlutterwave = new Flutterwave('bad_id', 'bad_secret');

    await expect(badFlutterwave.generateAccessToken()).rejects.toThrow(
      UnauthorizedRequestException,
    );
  });
});
```

## Related

- [Configuration](/guide/configuration) - Proper SDK configuration
- [Getting Started](/guide/getting-started) - Basic SDK usage
- [API Reference](/api/overview) - Complete API documentation
