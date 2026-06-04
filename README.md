# squad-ts

A comprehensive TypeScript SDK for the [Squad payment gateway](https://squadco.com) — fully typed, dual ESM/CJS, and covering every documented API endpoint.

## Installation

```bash
npm install squad-ts
# or
yarn add squad-ts
# or
pnpm add squad-ts
```

## Quick Start

```typescript
import { Squad } from "squad-ts";

const squad = new Squad({
  secretKey: "sandbox_sk_your_key_here",
  environment: "sandbox", // 'sandbox' | 'live' — defaults to 'live'
  timeout: 30000,         // optional, ms — defaults to 30000
});

// Initiate a payment
const payment = await squad.payments.initiate({
  email: "customer@example.com",
  amount: 100000, // in kobo (100000 kobo = ₦1,000)
  currency: "NGN",
  initiate_type: "inline",
  transaction_ref: "TXN_" + Date.now(),
  callback_url: "https://yourapp.com/payment/callback",
});

console.log(payment.data.checkout_url);
// → https://checkout.squadco.com/pay/...
```

## Configuration

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `secretKey` | `string` | Yes | — | Your Squad secret key (`sandbox_sk_...` or `sk_...`) |
| `environment` | `'sandbox' \| 'live'` | No | `'live'` | API environment |
| `timeout` | `number` | No | `30000` | Request timeout in milliseconds |

**Sandbox base URL:** `https://sandbox-api-d.squadco.com`  
**Live base URL:** `https://api-d.squadco.com`

---

## API Reference

### `squad.payments`

#### `initiate(payload)`

Initiates a payment and returns a checkout URL.

```typescript
const response = await squad.payments.initiate({
  email: "customer@example.com",
  amount: 100000,           // required, in kobo
  currency: "NGN",          // optional
  initiate_type: "inline",  // 'inline' | 'redirect'
  transaction_ref: "TXN_001",
  callback_url: "https://yourapp.com/callback",
  payment_channels: ["card", "bank_transfer", "ussd"],
  pass_charge: false,       // pass fees to customer
  metadata: { orderId: "ORD_001" },
});

// response.data.checkout_url — redirect customer here
```

#### `verify(transactionRef)`

Verifies a transaction by reference.

```typescript
const result = await squad.payments.verify("TXN_001");

console.log(result.data.transaction_status); // 'Success' | 'Failed' | 'Abandoned' | 'Pending'
console.log(result.data.transaction_amount); // amount in kobo
```

#### `getTransaction(transactionRef)`

Convenience method — returns `data` directly (unwrapped).

```typescript
const txn = await squad.payments.getTransaction("TXN_001");
console.log(txn.email);
```

#### `getAllTransactions(params?)`

Get all transactions with optional filters.

```typescript
const result = await squad.payments.getAllTransactions({
  page: 1,
  perPage: 20,
  dir: "DESC",
});

result.data.rows.forEach((txn) => console.log(txn.transaction_ref));
```

#### `charge(payload)` — Direct API

Charge a card/bank/USSD directly without the hosted checkout.

```typescript
const result = await squad.payments.charge({
  transaction_reference: "DIRECT_001",
  amount: 10000,
  currency: "NGN",
  payment_method: "card",
  card: {
    number: "5061000000000000000",
    cvv: "123",
    expiry_month: "12",
    expiry_year: "26",
  },
  customer: { name: "John Doe", email: "john@example.com" },
});

// result.data.auth_model: 'ValidatePin' | 'ValidateOTP' | 'ThreeDSecure'
```

#### `authorize(payload)` — Direct API PIN/OTP

```typescript
await squad.payments.authorize({
  transaction_reference: "DIRECT_001",
  authorization: { pin: "1234" }, // or { otp: "123456" }
});
```

#### `verifyPos(transactionReference)`

Verify a POS/SoftPOS transaction.

---

### `squad.transfers`

#### `accountLookup(payload)`

Resolve account holder name before initiating a transfer.

```typescript
const result = await squad.transfers.accountLookup({
  bank_code: "058",
  account_number: "0123456789",
});

console.log(result.data.account_name); // 'JOHN DOE'
```

#### `initiateTransfer(payload)`

Send money to a bank account. **Always prepend your merchant ID to the transaction reference.**

```typescript
const result = await squad.transfers.initiateTransfer({
  transaction_reference: "MERCHANTID_TRF001", // must include your merchant ID prefix
  amount: "100000",     // in kobo
  bank_code: "058",
  account_number: "0123456789",
  account_name: "JOHN DOE", // from accountLookup
  currency_id: "NGN",
  remark: "Payment for services",
});

console.log(result.data.nip_transaction_reference);
```

> **Important:** If you receive error code `424` (timeout), call `requery()` with the same reference before retrying. Never reuse a timed-out reference.

#### `requery(payload)`

Re-query a transfer status.

```typescript
const status = await squad.transfers.requery({
  transaction_reference: "MERCHANTID_TRF001",
});
```

#### `getAllTransfers(params)`

```typescript
const transfers = await squad.transfers.getAllTransfers({
  page: 1,
  perPage: 50,
  dir: "DESC",
});
```

#### `getBanks()`

Get the list of supported banks.

```typescript
const { data } = await squad.transfers.getBanks();
data.forEach((bank) => console.log(bank.bank_code, bank.bank_name));
```

---

### `squad.virtualAccounts`

#### `create(payload)`

Create a customer virtual account (fly-through account tied to GTBank).

```typescript
const account = await squad.virtualAccounts.create({
  first_name: "John",
  last_name: "Doe",
  middle_name: "Paul",
  mobile_num: "08012345678",
  dob: "01/01/1990",           // mm/dd/yyyy
  email: "john@example.com",
  bvn: "22222222222",
  gender: "1",                  // '1' = Male, '2' = Female
  address: "1 Test Street, Lagos",
  customer_identifier: "CUST_001", // your unique customer ID
  beneficiary_account: "0123456789", // 10-digit GTBank account
});

console.log(account.data.virtual_account_number);
```

#### `createBusiness(payload)`

```typescript
const bizAccount = await squad.virtualAccounts.createBusiness({
  bvn: "22222222222",
  business_name: "Techzilla Ltd",
  customer_identifier: "BIZ_001",
  mobile_num: "08012345678",
  beneficiary_account: "0123456789",
});
```

#### `getCustomerTransactions(customer_identifier)`

```typescript
const txns = await squad.virtualAccounts.getCustomerTransactions("CUST_001");
```

#### `getMerchantTransactions()`

Get all incoming transactions across your merchant account.

#### `getMerchantTransactionsFiltered(params)`

```typescript
const result = await squad.virtualAccounts.getMerchantTransactionsFiltered({
  page: 1,
  perPage: 20,
  startDate: "01-01-2024",  // MM-DD-YYYY
  endDate: "12-31-2024",
  dir: "DESC",
});
```

#### `getCustomerByVirtualAccount(virtual_account_number)`

#### `getCustomerByIdentifier(customer_identifier)`

#### `getMerchantAccounts(params?)`

#### `simulatePayment(payload)` — sandbox only

```typescript
await squad.virtualAccounts.simulatePayment({
  virtual_account_number: "7834927713",
  amount: "10000",
});
```

#### `initiateDynamic(payload)` — Dynamic Virtual Accounts

```typescript
const dva = await squad.virtualAccounts.initiateDynamic({
  amount: 50000,
  duration: 3600, // seconds until expiry
  email: "user@example.com",
  transaction_ref: "DVA_001",
});

console.log(dva.data.account_number);
console.log(dva.data.expires_at);
```

#### `updateDynamic(payload)`

```typescript
await squad.virtualAccounts.updateDynamic({
  transaction_reference: "DVA_001",
  amount: 60000,
  duration: 7200,
});
```

#### `getDynamicTransactions(transaction_reference)`

```typescript
const txns = await squad.virtualAccounts.getDynamicTransactions("DVA_001");
// txns.data.rows[0].transaction_status: 'SUCCESS' | 'EXPIRED' | 'MISMATCH'
```

---

### `squad.recurring`

#### `createSubscriptionPlan(payload)`

```typescript
const plan = await squad.recurring.createSubscriptionPlan({
  name: "Monthly Premium",
  amount: 5000, // kobo
  interval: "monthly", // 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  description: "Access to premium features",
});

console.log(plan.data.plan_code); // save this
```

#### `updateSubscriptionPlan(payload)`

```typescript
await squad.recurring.updateSubscriptionPlan({
  plan_code: "PLAN_001",
  name: "Monthly Premium Plus",
  amount: 7500,
});
```

#### `getAllSubscriptionPlans()`

#### `getSubscriptionPlan(plan_code)`

#### `customerSubscription(payload)`

Subscribe a customer (requires a tokenized card `token_id`).

```typescript
await squad.recurring.customerSubscription({
  plan_code: "PLAN_001",
  email: "customer@example.com",
  token_id: "TOKEN_FROM_PAYMENT",
});
```

#### `cancelSubscription(payload)`

```typescript
await squad.recurring.cancelSubscription({
  subscription_code: "SUB_001",
  email: "customer@example.com",
  token_id: "TOKEN_FROM_PAYMENT",
});
```

#### `getAllSubscriptions()`

#### `getSubscription(subscription_code)`

---

### `squad.refunds`

#### `initiate(payload)`

```typescript
const refund = await squad.refunds.initiate({
  gateway_transaction_ref: "GW_REF_001", // from webhook
  transaction_ref: "TXN_REF_001",
  refund_type: "Full",                   // 'Full' | 'Partial'
  reason_for_refund: "Customer request",
  // refund_amount: "5000",              // required for Partial (in kobo)
});

console.log(refund.data.refund_reference);
```

#### `getAll(params?)`

```typescript
const refunds = await squad.refunds.getAll({ page: 1, perPage: 10 });
```

#### `update(payload)`

```typescript
await squad.refunds.update({
  gateway_transaction_ref: "GW_REF_001",
  action: "accept",
});
```

---

### `squad.disputes`

#### `getAll()`

```typescript
const disputes = await squad.disputes.getAll();
```

#### `getUploadUrl(ticket_id, file_name)`

Get a pre-signed URL to upload evidence for a rejected dispute.

```typescript
const { data } = await squad.disputes.getUploadUrl("TICKET_001", "evidence.pdf");
// Upload your file to data.upload_url
```

#### `resolve(ticket_id, payload)`

```typescript
await squad.disputes.resolve("TICKET_001", {
  action: "rejected", // 'accepted' | 'rejected'
  file_name: "evidence.pdf",
});
```

---

### `squad.vas`

#### `purchaseAirtime(payload)`

```typescript
const result = await squad.vas.purchaseAirtime({
  phone_number: "08012345678",
  amount: 100, // Naira (minimum 50)
});
```

#### `purchaseData(payload)`

```typescript
await squad.vas.purchaseData({
  phone_number: "08012345678",
  plan_code: "1001", // from getDataBundles
  amount: 1000,
});
```

#### `getDataBundles(network)`

```typescript
const bundles = await squad.vas.getDataBundles("MTN");
// bundles.data: [{ plan_name, bundle_value, bundle_price, plan_code, ... }]
```

#### `getMobileNetworks()`

Returns the list of supported networks: `MTN | GLO | AIRTEL | 9MOBILE`.

#### `getTransactions(params)`

```typescript
await squad.vas.getTransactions({ page: 1, perPage: 20, action: "debit" });
```

---

### `squad.paymentLinks`

#### `create(payload)`

```typescript
const link = await squad.paymentLinks.create({
  name: "Pay for invoice #123",
  description: "Payment for consulting services",
  amount: 150000, // optional — leave out for open amount
  redirect_link: "https://yourapp.com/success",
  support_email: "billing@yourapp.com",
});

// Share link.data.checkout_url with your customer
```

#### `update(id, payload)`

```typescript
await squad.paymentLinks.update("LINK_001", { amount: 200000 });
```

#### `getAll()`

#### `getOne(id)`

#### `toggleStatus(id)`

Enable/disable a payment link.

---

### `squad.webhooks`

#### Verifying Webhook Signatures

Squad sends an `x-squad-encrypted-body` header with every webhook. Always validate it before processing.

```typescript
// Express example
app.post("/webhook/squad", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.headers["x-squad-encrypted-body"] as string;
  const isValid = squad.webhooks.validateWebhook(
    req.body,
    signature,
    process.env.SQUAD_SECRET_KEY!,
  );

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = squad.webhooks.parseEvent(JSON.parse(req.body as unknown as string));

  // ⚠️ Always check your DB to avoid processing the same transaction twice
  if (event.Event === "charge_successful") {
    const { transaction_ref, amount, email } = event.Body;
    // Fulfill order, credit wallet, etc.
  }

  // Acknowledge immediately
  const ack = squad.webhooks.buildAcknowledgment(event.TransactionRef, 200);
  res.json(ack);
});
```

#### Virtual Account Webhook Validation (v2/v3)

```typescript
const isValid = squad.webhooks.validateVirtualAccountWebhook(
  payload,          // the parsed webhook body
  signature,        // x-squad-signature header
  "your_secret_key",
);
```

For **v1** webhooks, the entire body is hashed.  
For **v2/v3** webhooks, only these 6 pipe-delimited fields are hashed:
```
transaction_reference|virtual_account_number|currency|principal_amount|settled_amount|customer_identifier
```

#### `buildAcknowledgment(transaction_reference, status?)`

Build the required response format:

```typescript
res.json(squad.webhooks.buildAcknowledgment("TXN_001", 200));
// { response_code: 200, transaction_reference: "TXN_001", response_description: "Success" }
```

---

## Error Handling

All API errors throw a `SquadError`, which extends the native `Error` class.

```typescript
import { Squad, SquadError } from "squad-ts";

try {
  await squad.payments.verify("INVALID_REF");
} catch (err) {
  if (err instanceof SquadError) {
    console.error(err.message);     // Human-readable message
    console.error(err.statusCode);  // HTTP status code (400, 401, 403, etc.)
    console.error(err.data);        // Raw Squad API error response
  }
}
```

### Error Types

| Scenario | `statusCode` | Example `message` |
|----------|-------------|-------------------|
| Invalid transaction ref | `400` | `"Invalid transaction reference"` |
| Missing/bad API key | `401` | `"Unauthorized"` |
| Wrong environment key | `403` | `"API key is invalid. Key must start with sandbox_sk_"` |
| Transfer timeout | `424` | `"Transaction timed out"` |
| Network error | `0` | `"Network error — check your connection"` |
| Request timeout | `408` | `"Request timed out"` |

---

## TypeScript Usage

All types are exported and can be imported directly:

```typescript
import type {
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  VerifyTransactionData,
  InitiateTransferPayload,
  CreateCustomerVirtualAccountPayload,
  VirtualAccountTransaction,
  WebhookEvent,
  VirtualAccountWebhookPayload,
  SubscriptionPlan,
  DataBundle,
  MobileNetwork,
  SquadError,
} from "squad-ts";
```

### Typed Webhook Handler

```typescript
import type { WebhookEvent, VirtualAccountWebhookPayload } from "squad-ts";

function handleCheckoutWebhook(event: WebhookEvent) {
  if (event.Event === "charge_successful") {
    const { transaction_type, amount, email } = event.Body;
    // transaction_type: 'Card' | 'Transfer' | 'Bank' | 'Ussd' | 'MerchantUssd'
  }
}

function handleVirtualAccountWebhook(payload: VirtualAccountWebhookPayload) {
  const { transaction_reference, principal_amount, sender_name } = payload;
}
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
SQUAD_SECRET_KEY=sandbox_sk_your_key_here
SQUAD_ENVIRONMENT=sandbox
```

Then load it:

```typescript
import { Squad } from "squad-ts";
import "dotenv/config";

const squad = new Squad({
  secretKey: process.env.SQUAD_SECRET_KEY!,
  environment: (process.env.SQUAD_ENVIRONMENT as "sandbox" | "live") ?? "sandbox",
});
```

---

## Webhook IP Allowlist

Squad sends webhooks from:

```
18.133.63.109
```

Configure your firewall or reverse proxy to accept requests from this IP on your webhook endpoint.

---

## Key Business Rules

1. **Transfer references** must be prefixed with your merchant ID, e.g. `"SBABCKDY_uniqueref"`.
2. **Error 424 on transfers** — always `requery()` before retrying. Never retry with the same reference.
3. **Account lookup before transfer** — always call `accountLookup()` first and use its `account_name` result.
4. **Idempotency on webhooks** — store and check `transaction_ref` before fulfilling orders to avoid double-crediting.
5. **BVN validation** on virtual accounts is strict — name, DOB, gender, and phone must match exactly.

---

## Contributing

```bash
git clone https://github.com/yourusername/squad-ts.git
cd squad-ts
npm install

npm test           # run tests
npm run build      # build dist/
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # tsc --noEmit
```

Please open an issue or PR for any missing endpoints or type corrections.

---

## License

MIT
