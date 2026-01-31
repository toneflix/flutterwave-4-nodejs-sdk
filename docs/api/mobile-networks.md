# Mobile Networks API

The Mobile Networks API provides information about mobile money network providers in different countries.

## Methods

### list()

Get a list of mobile networks in a specific country.

```typescript
async list(
  query: { country: string },
  traceId?: string
): Promise<IMobileNetwork[]>
```

#### Parameters

- `query.country` - Two-letter country code (e.g., 'CG', 'GH', 'KE')
- `traceId` - Optional trace ID for request tracking

#### Example

```typescript
const networks = await flutterwave.api.mobileNetworks.list(
  {
    country: 'CG',
  },
  'trace-id',
);

networks.forEach((network) => {
  console.log(`${network.name} - ${network.code}`);
});
```

## Type Definitions

### IMobileNetwork

```typescript
interface IMobileNetwork {
  id: string;
  name: string;
  code: string;
  country: string;
}
```

## Use Cases

### Display Available Networks

```typescript
async function getAvailableNetworks(countryCode: string) {
  const networks = await flutterwave.api.mobileNetworks.list({
    country: countryCode,
  });

  console.log(`Available networks in ${countryCode}:`);
  networks.forEach((network) => {
    console.log(`- ${network.name}`);
  });

  return networks;
}
```

### Validate Network Before Transfer

```typescript
async function validateMobileMoneyTransfer(
  countryCode: string,
  networkCode: string,
) {
  const networks = await flutterwave.api.mobileNetworks.list({
    country: countryCode,
  });

  const network = networks.find((n) => n.code === networkCode);

  if (!network) {
    throw new Error(`Network ${networkCode} not available in ${countryCode}`);
  }

  return network;
}
```

### Build Network Selector

```typescript
async function buildNetworkSelector(countryCode: string) {
  const networks = await flutterwave.api.mobileNetworks.list({
    country: countryCode,
  });

  return networks.map((network) => ({
    label: network.name,
    value: network.code,
  }));
}
```

## Best Practices

### 1. Cache Network Lists

Mobile network lists don't change frequently. Cache them:

```typescript
const networkCache = new Map<string, IMobileNetwork[]>();

async function getCachedNetworks(
  countryCode: string,
): Promise<IMobileNetwork[]> {
  if (networkCache.has(countryCode)) {
    return networkCache.get(countryCode)!;
  }

  const networks = await flutterwave.api.mobileNetworks.list({
    country: countryCode,
  });

  networkCache.set(countryCode, networks);
  return networks;
}
```

### 2. Validate Network Availability

```typescript
async function isNetworkAvailable(
  countryCode: string,
  networkCode: string,
): Promise<boolean> {
  const networks = await getCachedNetworks(countryCode);
  return networks.some((n) => n.code === networkCode);
}
```

### 3. Group Networks by Country

```typescript
async function getNetworksByCountries(countries: string[]) {
  const results: Record<string, IMobileNetwork[]> = {};

  for (const country of countries) {
    results[country] = await flutterwave.api.mobileNetworks.list({
      country,
    });
  }

  return results;
}
```

## Error Handling

```typescript
try {
  const networks = await flutterwave.api.mobileNetworks.list({
    country: 'CG',
  });

  console.log(`Found ${networks.length} networks`);
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid country code:', error.message);
  } else {
    console.error('Failed to fetch networks:', error);
  }
}
```

## Supported Countries

Common countries with mobile money support include:

- CG (Congo)
- GH (Ghana)
- KE (Kenya)
- RW (Rwanda)
- TZ (Tanzania)
- UG (Uganda)
- ZM (Zambia)

Check the API response for the most current list of supported countries.

## Related APIs

- [Transfers](/api/transfers) - Send mobile money transfers
- [Transfer Recipients](/api/transfer-recipients) - Create mobile money recipients
