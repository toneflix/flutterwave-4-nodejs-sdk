# v3 API Reference Overview

The Flutterwave Node.js SDK provides a comprehensive interface to all Flutterwave v4 API endpoints and v3 APIs currently missing from the v4 API. All V3 API methods and endpoints are available through the `flutterwave.v3` object.

```typescript
const verification = await flutterwave.v3.bvn.verifications('00000000000');
```

## Available APIs

### Misc

- **[BVN](/api/v3/bvn)** - Retrieve BVN consent request verifications
