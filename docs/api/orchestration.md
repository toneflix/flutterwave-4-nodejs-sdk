# Orchestration API

The Orchestration API provides streamlined methods to create charges and orders without pre-creating customers and payment methods. This is ideal for one-time payments where you want to process everything in a single request.

## Methods

### directCharges()

Create a charge with inline customer and payment method details.

```typescript
async directCharges(
  data: IDirectChargeCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<ICharge>
```

#### Parameters

- `data` - Complete charge information including customer and payment method
- `traceId` - Optional trace ID for request tracking
- `indempotencyKey` - Optional idempotency key to prevent duplicates

#### Example

```typescript
const charge = await flutterwave.api.orchestration.directCharges(
  {
    amount: 2000,
    currency: 'NGN',
    reference: `charge-${Date.now()}`,
    customer: {
      email: 'customer@example.com',
      name: {
        first: 'John',
        last: 'Doe',
      },
      address: {
        line1: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        country: 'NG',
        postal_code: '100001',
      },
      phone: {
        country_code: '234',
        number: '8012345678',
      },
    },
    payment_method: {
      type: 'card',
      card: {
        card_number: '4242424242424242',
        cvv: '123',
        expiry_month: '12',
        expiry_year: '30',
      },
    },
  },
  'trace-id',
  'idem-key',
);

console.log('Charge ID:', charge.id);
console.log('Amount:', charge.amount);
```

### directOrders()

Create an order with inline customer and payment method details.

```typescript
async directOrders(
  data: IDirectChargeCreateForm,
  traceId?: string,
  indempotencyKey?: string
): Promise<IOrder>
```

#### Parameters

Same as `directCharges()`

#### Example

```typescript
const order = await flutterwave.api.orchestration.directOrders(
  {
    amount: 2000,
    currency: 'NGN',
    reference: `order-${Date.now()}`,
    customer: {
      email: 'customer@example.com',
      name: {
        first: 'Jane',
        last: 'Smith',
      },
      address: {
        line1: '456 Business Ave',
        city: 'Abuja',
        state: 'FCT',
        country: 'NG',
        postal_code: '900001',
      },
      phone: {
        country_code: '234',
        number: '8098765432',
      },
    },
    payment_method: {
      type: 'card',
      card: {
        card_number: '4242424242424242',
        cvv: '123',
        expiry_month: '12',
        expiry_year: '30',
      },
    },
  },
  'trace-id',
  'idem-key',
);

console.log('Order ID:', order.id);
console.log('Status:', order.status);
```

## Type Definitions

### IDirectChargeCreateForm

```typescript
interface IDirectChargeCreateForm {
  amount: number;
  currency: string;
  reference: string;
  customer: {
    email: string;
    name: {
      first: string;
      last: string;
    };
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    phone: {
      country_code: string;
      number: string;
    };
    meta?: Record<string, any>;
  };
  payment_method: {
    type: 'card';
    card: {
      card_number: string;
      cvv: string;
      expiry_month: string;
      expiry_year: string;
    };
  };
}
```

## Use Cases

### One-Time Payment Checkout

Perfect for e-commerce checkouts where customers pay once:

```typescript
async function processCheckout(orderData: any, cardData: any) {
  const charge = await flutterwave.api.orchestration.directCharges({
    amount: orderData.total,
    currency: 'NGN',
    reference: `checkout-${orderData.orderId}`,
    customer: {
      email: orderData.customerEmail,
      name: orderData.customerName,
      address: orderData.shippingAddress,
      phone: orderData.phone,
    },
    payment_method: {
      type: 'card',
      card: {
        card_number: cardData.number,
        cvv: cardData.cvv,
        expiry_month: cardData.expiryMonth,
        expiry_year: cardData.expiryYear,
      },
    },
  });

  return charge;
}
```

### Guest Checkout

Allow customers to pay without creating an account:

```typescript
async function guestCheckout(paymentData: any) {
  return await flutterwave.api.orchestration.directCharges({
    amount: paymentData.amount,
    currency: 'NGN',
    reference: `guest-${Date.now()}`,
    customer: {
      email: paymentData.email,
      name: {
        first: paymentData.firstName,
        last: paymentData.lastName,
      },
      address: paymentData.address,
      phone: paymentData.phone,
    },
    payment_method: paymentData.paymentMethod,
  });
}
```

### Pre-Authorization Payment

Use `directOrders()` for pre-authorization:

```typescript
async function preAuthorizePayment(bookingData: any) {
  const order = await flutterwave.api.orchestration.directOrders({
    amount: bookingData.depositAmount,
    currency: 'NGN',
    reference: `booking-${bookingData.bookingId}`,
    customer: bookingData.customer,
    payment_method: bookingData.paymentMethod,
  });

  // Later, capture the payment
  await flutterwave.api.orders.update(order.id, {
    action: 'capture',
  });
}
```

## Best Practices

### 1. Validate Card Before Submission

```typescript
function validateCard(card: any): boolean {
  // Check expiry
  const currentYear = new Date().getFullYear() % 100;
  const expiryYear = parseInt(card.expiry_year);

  if (expiryYear < currentYear) {
    throw new Error('Card has expired');
  }

  // Check card number length
  if (card.card_number.length < 13 || card.card_number.length > 19) {
    throw new Error('Invalid card number');
  }

  return true;
}
```

### 2. Use Unique References

```typescript
const reference = `orch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

### 3. Implement Idempotency

```typescript
const idempotencyKey = `checkout-${sessionId}-${attempt}`;

const charge = await flutterwave.api.orchestration.directCharges(
  chargeData,
  traceId,
  idempotencyKey,
);
```

### 4. Sanitize Customer Data

```typescript
function sanitizeCustomerData(data: any) {
  return {
    email: data.email.toLowerCase().trim(),
    name: {
      first: data.firstName.trim(),
      last: data.lastName.trim(),
    },
    phone: {
      country_code: data.phone.countryCode.replace(/\D/g, ''),
      number: data.phone.number.replace(/\D/g, ''),
    },
    address: {
      line1: data.address.line1.trim(),
      city: data.address.city.trim(),
      state: data.address.state.trim(),
      country: data.address.country.toUpperCase(),
      postal_code: data.address.postalCode.trim(),
    },
  };
}
```

## Error Handling

```typescript
try {
  const charge = await flutterwave.api.orchestration.directCharges({
    amount: 5000,
    currency: 'NGN',
    reference: `ref-${Date.now()}`,
    customer: customerData,
    payment_method: paymentMethodData,
  });

  console.log('Payment successful:', charge.id);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid payment data:', error.message);
  } else if (error instanceof UnauthorizedRequestException) {
    console.error('Authentication failed. Check encryption key.');
  } else {
    console.error('Payment failed:', error);
  }
}
```

## Orchestration vs Standard Flow

**Use Orchestration API when:**

- Processing one-time payments
- Building guest checkout flows
- You don't need to store customer/payment method data
- Simplicity and speed are priorities

**Use Standard API when:**

- Building recurring payment systems
- Need to store payment methods for future use
- Want to separate customer creation from payment
- Building customer management features

## Security Considerations

### Card Encryption

The SDK automatically encrypts card data using your encryption key:

```typescript
// Ensure encryption key is configured
const flutterwave = new Flutterwave({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY!, // Required for card operations
});
```

### PCI Compliance

- Never log card details
- Use HTTPS for all requests
- Store only necessary customer data
- Implement proper error handling to avoid exposing sensitive data

```typescript
// Good
console.log('Processing payment for:', customerEmail);

// Bad - Never do this
// console.log('Card details:', cardData);
```

## Related APIs

- [Charges](/api/charges) - Standard charge creation
- [Orders](/api/orders) - Standard order creation
- [Customers](/api/customers) - Customer management
- [Payment Methods](/api/payment-methods) - Payment method storage
