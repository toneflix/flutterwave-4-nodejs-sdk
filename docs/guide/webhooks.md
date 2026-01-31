# Webhook Validation

Webhooks allow Flutterwave to notify your application about events that happen in your account, such as successful payments, failed transactions, or completed transfers. The SDK provides a `WebhookValidator` class to verify that webhook requests are genuinely from Flutterwave.

## Overview

When Flutterwave sends a webhook to your server, it includes a signature in the request headers. This signature is generated using a secret hash that only you and Flutterwave know. By validating this signature, you can ensure the webhook is authentic and hasn't been tampered with.

## Setup

### 1. Get Your Secret Hash

First, obtain your webhook secret hash from the Flutterwave Dashboard:

1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → Webhooks
3. Copy your Secret Hash

### 2. Store the Secret Hash

Store your secret hash securely as an environment variable:

```bash
# .env
SECRET_HASH=your_secret_hash_here
```

### 3. Import WebhookValidator

```typescript
import { WebhookValidator } from 'flutterwave-node-v4';
```

## Basic Usage

### Creating a Validator Instance

```typescript
import { WebhookValidator } from 'flutterwave-node-v4';

const validator = new WebhookValidator(process.env.SECRET_HASH!);
```

### Validating Webhooks

The `validate()` method takes two parameters:

- The raw request body as a string
- The signature from the request headers

```typescript
const isValid = validator.validate(rawBody, signature);

if (isValid) {
  console.log('Webhook is authentic');
} else {
  console.log('Webhook is invalid or tampered with');
}
```

### Generating Signatures (for testing)

You can generate signatures for testing purposes:

```typescript
const signature = validator.generateSignature(rawBody);
```

## Express.js Implementation

Here's a complete example using Express.js:

```typescript
import express from 'express';
import { WebhookValidator } from 'flutterwave-node-v4';

const app = express();
const validator = new WebhookValidator(process.env.SECRET_HASH!);

// Important: Use express.raw() to get the raw body for signature validation
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['verif-hash'] as string;
  const rawBody = req.body.toString('utf8');

  // Validate the webhook signature
  if (!validator.validate(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return res.sendStatus(401);
  }

  // Parse the validated webhook
  const event = JSON.parse(rawBody);

  // Process the webhook
  processWebhook(event);

  res.sendStatus(200);
});

function processWebhook(event: any): void {
  console.log('Webhook event:', event.event);
  console.log('Webhook data:', event.data);
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## Node.js HTTP Server Implementation

Using the built-in HTTP module:

```typescript
import http from 'http';
import { WebhookValidator } from 'flutterwave-node-v4';

const validator = new WebhookValidator(process.env.SECRET_HASH!);

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const signature = req.headers['verif-hash'] as string;

      if (!validator.validate(body, signature)) {
        console.error('Invalid webhook signature');
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }

      const event = JSON.parse(body);
      processWebhook(event);

      res.writeHead(200);
      res.end('OK');
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

## Fastify Implementation

```typescript
import Fastify from 'fastify';
import { WebhookValidator } from 'flutterwave-node-v4';

const fastify = Fastify();
const validator = new WebhookValidator(process.env.SECRET_HASH!);

fastify.post('/webhook', {
  config: {
    rawBody: true,
  },
  handler: async (request, reply) => {
    const signature = request.headers['verif-hash'] as string;
    const rawBody = request.rawBody as string;

    if (!validator.validate(rawBody, signature)) {
      return reply.code(401).send({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);
    processWebhook(event);

    return reply.code(200).send({ status: 'ok' });
  },
});

fastify.listen({ port: 3000 });
```

## Webhook Event Types

Flutterwave sends different types of webhook events. Here's how to handle them:

```typescript
function processWebhook(event: any): void {
  switch (event.event) {
    case 'charge.completed':
      handleChargeCompleted(event.data);
      break;

    case 'transfer.completed':
      handleTransferCompleted(event.data);
      break;

    case 'transfer.failed':
      handleTransferFailed(event.data);
      break;

    case 'virtual_account.credited':
      handleVirtualAccountCredited(event.data);
      break;

    case 'refund.completed':
      handleRefundCompleted(event.data);
      break;

    default:
      console.log('Unhandled webhook event:', event.event);
  }
}

function handleChargeCompleted(data: any): void {
  console.log('Charge completed:', data.id);
  console.log('Amount:', data.amount);
  console.log('Customer:', data.customer);

  // Update your database
  // Send confirmation email
  // etc.
}

function handleTransferCompleted(data: any): void {
  console.log('Transfer completed:', data.id);
  console.log('Reference:', data.reference);

  // Update transfer status in database
}

function handleVirtualAccountCredited(data: any): void {
  console.log('Virtual account credited:', data.account_number);
  console.log('Amount:', data.amount);

  // Credit customer account
  // Send notification
}
```

## Advanced Validation

### Validate and Process in One Function

```typescript
function validateAndProcessWebhook(
  rawBody: string,
  signature: string,
): boolean {
  const validator = new WebhookValidator(process.env.SECRET_HASH!);

  if (!validator.validate(rawBody, signature)) {
    console.error('Invalid webhook signature');
    return false;
  }

  try {
    const event = JSON.parse(rawBody);
    processWebhook(event);
    return true;
  } catch (error) {
    console.error('Error processing webhook:', error);
    return false;
  }
}
```

### Logging Webhooks

```typescript
interface WebhookLog {
  timestamp: string;
  event: string;
  valid: boolean;
  data: any;
}

const webhookLogs: WebhookLog[] = [];

function logWebhook(rawBody: string, signature: string, valid: boolean): void {
  const event = valid ? JSON.parse(rawBody) : null;

  const log: WebhookLog = {
    timestamp: new Date().toISOString(),
    event: event?.event || 'unknown',
    valid,
    data: event?.data || null,
  };

  webhookLogs.push(log);

  if (!valid) {
    console.warn('Invalid webhook received:', log);
  }
}

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['verif-hash'] as string;
  const rawBody = req.body.toString('utf8');
  const valid = validator.validate(rawBody, signature);

  logWebhook(rawBody, signature, valid);

  if (!valid) {
    return res.sendStatus(401);
  }

  const event = JSON.parse(rawBody);
  processWebhook(event);

  res.sendStatus(200);
});
```

## Testing Webhooks

### Manual Testing

Generate test signatures for local testing:

```typescript
import { WebhookValidator } from 'flutterwave-node-v4';

const validator = new WebhookValidator(process.env.SECRET_HASH!);

const testPayload = JSON.stringify({
  event: 'charge.completed',
  data: {
    id: 'test_123',
    amount: 5000,
    currency: 'NGN',
  },
});

const signature = validator.generateSignature(testPayload);

console.log('Test payload:', testPayload);
console.log('Test signature:', signature);

// Use these values to test your webhook endpoint
```

### Automated Testing

```typescript
import { describe, it, expect } from 'vitest';
import { WebhookValidator } from 'flutterwave-node-v4';

describe('Webhook Validation', () => {
  const secretHash = 'test_secret_hash';
  const validator = new WebhookValidator(secretHash);

  it('should validate correct signature', () => {
    const payload = JSON.stringify({ event: 'test', data: {} });
    const signature = validator.generateSignature(payload);

    expect(validator.validate(payload, signature)).toBe(true);
  });

  it('should reject invalid signature', () => {
    const payload = JSON.stringify({ event: 'test', data: {} });
    const wrongSignature = 'wrong_signature';

    expect(validator.validate(payload, wrongSignature)).toBe(false);
  });

  it('should reject tampered payload', () => {
    const payload = JSON.stringify({ event: 'test', data: {} });
    const signature = validator.generateSignature(payload);

    const tamperedPayload = JSON.stringify({
      event: 'test',
      data: { hacked: true },
    });

    expect(validator.validate(tamperedPayload, signature)).toBe(false);
  });
});
```

## Best Practices

### 1. Always Validate Signatures

Never process webhooks without validation:

```typescript
// Bad
app.post('/webhook', (req, res) => {
  processWebhook(req.body); // Dangerous!
  res.sendStatus(200);
});

// Good
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['verif-hash'] as string;
  const rawBody = req.body.toString('utf8');

  if (!validator.validate(rawBody, signature)) {
    return res.sendStatus(401);
  }

  processWebhook(JSON.parse(rawBody));
  res.sendStatus(200);
});
```

### 2. Use Raw Body for Validation

Always use the raw request body for signature validation:

```typescript
// Express.js - use express.raw()
app.post('/webhook', express.raw({ type: 'application/json' }), handler);

// Don't use express.json() for webhook endpoints
// app.post('/webhook', express.json(), handler); // Wrong!
```

### 3. Respond Quickly

Process webhooks asynchronously and respond immediately:

```typescript
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['verif-hash'] as string;
  const rawBody = req.body.toString('utf8');

  if (!validator.validate(rawBody, signature)) {
    return res.sendStatus(401);
  }

  const event = JSON.parse(rawBody);

  // Respond immediately
  res.sendStatus(200);

  // Process asynchronously
  processWebhookAsync(event).catch((error) => {
    console.error('Webhook processing failed:', error);
  });
});

async function processWebhookAsync(event: any): Promise<void> {
  // Long-running operations here
  await updateDatabase(event);
  await sendNotifications(event);
}
```

### 4. Handle Duplicate Webhooks

Flutterwave may send the same webhook multiple times. Implement idempotency:

```typescript
const processedWebhooks = new Set<string>();

function processWebhookIdempotent(event: any): void {
  const webhookId = event.id || event.data?.id;

  if (processedWebhooks.has(webhookId)) {
    console.log('Duplicate webhook, skipping:', webhookId);
    return;
  }

  processedWebhooks.add(webhookId);
  processWebhook(event);
}
```

### 5. Secure Your Endpoint

Protect your webhook endpoint:

```typescript
// Only accept POST requests
if (req.method !== 'POST') {
  return res.sendStatus(405);
}

// Limit request size
app.use(
  '/webhook',
  express.raw({
    type: 'application/json',
    limit: '1mb',
  }),
);

// Rate limiting
import rateLimit from 'express-rate-limit';

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.post('/webhook', webhookLimiter, handler);
```

## Troubleshooting

### Signature Validation Fails

If validation consistently fails:

1. Verify your secret hash is correct
2. Ensure you're using the raw request body
3. Check that the body encoding is UTF-8
4. Verify the header name is exactly `verif-hash`

### Testing Locally

Use tools like ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL in Flutterwave Dashboard
```

## Related

- [Getting Started](/guide/getting-started) - SDK setup and initialization
- [Configuration](/guide/configuration) - Environment configuration
- [Error Handling](/guide/error-handling) - Handle webhook processing errors
