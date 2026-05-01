# BVN API (v3)

The BVN API (v3) provides methods for retrieving BVN consent request verifications. V3 endpoints are available through the `flutterwave.v3` object.

## Methods

### bvn.verifications()

Retrieve a BVN consent request verification by reference.

```typescript
async verifications(
  reference: string,
  query?: V3BvnVerificationQueryParams,
): Promise<V3BvnVerificationData>
```

#### Parameters

- `reference` - Unique identifier for the BVN consent request
- `query.include_complete_message` - Optional. Pass `true` or `1` to receive the complete message for the initiated BVN request. Defaults to `1`.

#### Example

```typescript
const verification = await flutterwave.v3.bvn.verifications('00000000000');

console.log('Reference:', verification.reference);
console.log('Status:', verification.status);
console.log('First name:', verification.first_name);
console.log('Last name:', verification.last_name);
```

#### Include Complete Message

```typescript
const verification = await flutterwave.v3.bvn.verifications('00000000000', {
  include_complete_message: true,
});

console.log(verification.bvn_data.complete_message);
```

## Type Definitions

### V3BvnVerificationQueryParams

```typescript
interface V3BvnVerificationQueryParams {
  include_complete_message?: string | number | boolean;
}
```

### V3BvnVerificationData

```typescript
interface V3BvnVerificationData {
  first_name: string;
  last_name: string;
  status: string;
  reference: string;
  callback_url: string;
  bvn_data: {
    bvn: string;
    nin: string;
    email: string;
    gender: string;
    surname: string;
    serialNo: string;
    faceImage: string;
    firstName: string;
    landmarks: string;
    branchName: string;
    middleName: string;
    nameOnCard: string;
    dateOfBirth: string;
    lgaOfOrigin: string;
    watchlisted: string;
    lgaOfCapture: string;
    phoneNumber1: string;
    phoneNumber2: string;
    maritalStatus: string;
    stateOfOrigin: string;
    enrollBankCode: string;
    enrollUserName: string;
    enrollmentDate: string;
    lgaOfResidence: string;
    stateOfCapture: string;
    additionalInfo1: string;
    productReference: string;
    stateOfResidence: string;
    created_at: string;
    complete_message: string;
  };
}
```
