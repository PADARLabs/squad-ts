# squad-ts

A comprehensive TypeScript SDK for the [Squad payment gateway](https://squadco.com) — fully typed, zero dependencies, dual ESM/CJS, and covering every documented API endpoint.

[![npm version](https://img.shields.io/npm/v/squad-ts)](https://www.npmjs.com/package/squad-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
  - [Payments](#squadpayments)
  - [Transfers](#squadtransfers)
  - [Virtual Accounts](#squadvirtualaccounts)
  - [Recurring Payments](#squadrecurring)
  - [Refunds](#squadrefunds)
  - [Disputes](#squaddisputes)
  - [Value-Added Services](#squadvas)
  - [Payment Links](#squadpaymentlinks)
  - [Webhooks](#squadwebhooks)
- [Error Handling](#error-handling)
- [TypeScript Usage](#typescript-usage)
- [Environment Variables](#environment-variables)
- [Key Business Rules](#key-business-rules)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install squad-ts
# or
yarn add squad-ts
# or
pnpm add squad-ts
```

---

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

---

## Configuration

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `secretKey` | `string` | Yes | — | Your Squad secret key (`sandbox_sk_...` or `sk_...`) |
| `environment` | `'sandbox' \| 'live'` | No | `'live'` | API environment |
| `timeout` | `number` | No | `30000` | Request timeout in milliseconds |

| Environment | Base URL |
|-------------|----------|
| `sandbox` | `https://sandbox-api-d.squadco.com` |
| `live` | `https://api-d.squadco.com` |

---

## API Reference

### `squad.payments`

#### `initiate(payload)`

Initiates a payment and returns a checkout URL to redirect or embed.

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

Verifies a transaction by reference. This is a read-only status check — it does not trigger any payment processing or notifications.

```typescript
const result = await squad.payments.verify("TXN_001");

console.log(result.data.transaction_status); // 'Success' | 'Failed' | 'Abandoned' | 'Pending'
console.log(result.data.transaction_amount); // amount in kobo
```

#### `getTransaction(transactionRef)`

Convenience wrapper around `verify` — returns `data` directly (unwrapped from the envelope).

```typescript
const txn = await squad.payments.getTransaction("TXN_001");
console.log(txn.email);
console.log(txn.transaction_status);
```

#### `getAllTransactions(params)`

Get all transactions with filters. Date range is required and must be within one month.

```typescript
const result = await squad.payments.getAllTransactions({
  page: 1,
  perPage: 20,
  currency: "NGN",
  start_date: "2026-05-01",
  end_date: "2026-05-31",
});

result.data.rows.forEach((txn) => console.log(txn.transaction_ref));
```

#### `charge(payload)` — Direct API

Charge a card directly without the hosted checkout page.

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

Submit a PIN or OTP to complete a direct charge flow.

```typescript
await squad.payments.authorize({
  transaction_reference: "DIRECT_001",
  authorization: { pin: "1234" }, // or { otp: "123456" }
});
```

#### `verifyPos(transactionReference)`

Verify a POS/SoftPOS transaction.

```typescript
const result = await squad.payments.verifyPos("POS_TXN_001");
```

---

### `squad.transfers`

#### `accountLookup(payload)`

Resolve an account holder's name before sending a transfer. Always do this first and use the returned name in `initiateTransfer`.

```typescript
const result = await squad.transfers.accountLookup({
  bank_code: "058",
  account_number: "0123456789",
});

console.log(result.data.account_name); // 'JOHN DOE'
```

#### `initiateTransfer(payload)`

Send money to a bank account.

> **Important:** The `transaction_reference` must be prefixed with your merchant ID (e.g. `"MERCHANTID_uniqueref"`). If you receive a `424` timeout error, call `requery()` with the same reference before retrying — never reuse a timed-out reference with a new one.

```typescript
const result = await squad.transfers.initiateTransfer({
  transaction_reference: "MERCHANTID_TRF001",
  amount: "100000",     // in kobo
  bank_code: "058",
  account_number: "0123456789",
  account_name: "JOHN DOE", // use the result from accountLookup
  currency_id: "NGN",
  remark: "Payment for services",
});

console.log(result.data.nip_transaction_reference);
```

#### `requery(payload)`

Re-query the status of a transfer. Use this after a `424` timeout before deciding to retry.

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

Get the list of all supported banks and their codes.

```typescript
const { data } = await squad.transfers.getBanks();
data.forEach((bank) => console.log(bank.bank_code, bank.bank_name));
```

---

### `squad.virtualAccounts`

#### `create(payload)`

Create a static virtual account for a customer (tied to GTBank).

```typescript
const account = await squad.virtualAccounts.create({
  first_name: "John",
  last_name: "Doe",
  middle_name: "Paul",
  mobile_num: "08012345678",
  dob: "01/01/1990",              // mm/dd/yyyy
  email: "john@example.com",
  bvn: "22222222222",
  gender: "1",                    // '1' = Male, '2' = Female
  address: "1 Test Street, Lagos",
  customer_identifier: "CUST_001", // your unique customer ID
  beneficiary_account: "0123456789", // 10-digit GTBank account
});

console.log(account.data.virtual_account_number);
```

#### `createBusiness(payload)`

Create a static virtual account for a business.

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

Get all incoming transactions for a specific customer.

```typescript
const txns = await squad.virtualAccounts.getCustomerTransactions("CUST_001");
```

#### `getMerchantTransactions()`

Get all incoming virtual account transactions across your merchant profile.

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

Retrieve a customer's details using their virtual account number.

```typescript
const customer = await squad.virtualAccounts.getCustomerByVirtualAccount("7834927713");
```

#### `getCustomerByIdentifier(customer_identifier)`

Retrieve a customer's details using the identifier you assigned when creating their account.

```typescript
const customer = await squad.virtualAccounts.getCustomerByIdentifier("CUST001");
```

#### `getMerchantAccounts(params?)`

List all virtual accounts created under your merchant profile.

```typescript
const accounts = await squad.virtualAccounts.getMerchantAccounts({ page: 1, perPage: 10 });
console.log(accounts.data.count);
console.log(accounts.data.rows);
```

#### `simulatePayment(payload)` — sandbox only

Simulate an incoming payment to a virtual account for testing.

```typescript
await squad.virtualAccounts.simulatePayment({
  virtual_account_number: "7834927713",
  amount: "10000",
});
```

#### `initiateDynamic(payload)` — Dynamic Virtual Accounts

Create a one-time virtual account that expires after a set duration or once the expected amount is received.

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

Update the amount or duration of an existing dynamic virtual account.

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

Create a recurring billing plan.

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

Retrieve all subscription plans under your merchant account.

```typescript
const plans = await squad.recurring.getAllSubscriptionPlans();
console.log(plans.data); // array of plans
```

#### `getSubscriptionPlan(plan_code)`

Retrieve a single subscription plan by its plan code.

```typescript
const plan = await squad.recurring.getSubscriptionPlan("PLAN_001");
console.log(plan.data.name);
```

#### `customerSubscription(payload)`

Subscribe a customer to a plan. Requires a tokenized card `token_id` obtained from a prior payment.

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

Retrieve all subscriptions (active and cancelled) under your merchant account.

```typescript
const subscriptions = await squad.recurring.getAllSubscriptions();
console.log(subscriptions.data); // array of subscriptions
```

#### `getSubscription(subscription_code)`

Retrieve a single subscription by its code.

```typescript
const subscription = await squad.recurring.getSubscription("SUB_001");
console.log(subscription.data.status); // "active" | "cancelled"
```

---

### `squad.refunds`

#### `initiate(payload)`

Initiate a full or partial refund on a completed transaction.

```typescript
const refund = await squad.refunds.initiate({
  gateway_transaction_ref: "GW_REF_001", // from webhook payload
  transaction_ref: "TXN_REF_001",
  refund_type: "Full",                   // 'Full' | 'Partial'
  reason_for_refund: "Customer request",
  // refund_amount: "5000",              // required only for Partial (in kobo)
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

Retrieve all disputes raised against your transactions.

```typescript
const disputes = await squad.disputes.getAll();
```

#### `getUploadUrl(ticket_id, file_name)`

Get a pre-signed S3 URL to upload evidence when rejecting a dispute.

```typescript
const { data } = await squad.disputes.getUploadUrl("TICKET_001", "evidence.pdf");
// Upload your file to data.upload_url, then call resolve()
```

#### `resolve(ticket_id, payload)`

Accept or reject a dispute.

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
  amount: 100, // Naira (minimum ₦50)
});
```

#### `purchaseData(payload)`

```typescript
await squad.vas.purchaseData({
  phone_number: "08012345678",
  plan_code: "1001", // from getDataBundles()
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

```typescript
const { networks } = await squad.vas.getMobileNetworks();
```

#### `getTransactions(params)`

```typescript
await squad.vas.getTransactions({ page: 1, perPage: 20, action: "debit" });
```

---

### `squad.paymentLinks`

#### `create(payload)`

Create a shareable payment link.

```typescript
const link = await squad.paymentLinks.create({
  name: "Pay for invoice #123",
  description: "Payment for consulting services",
  amount: 150000, // optional — omit for open-amount links
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

Retrieve all payment links under your merchant account.

```typescript
const links = await squad.paymentLinks.getAll();
console.log(links.data); // array of payment links
```

#### `getOne(id)`

Retrieve a single payment link by its ID.

```typescript
const link = await squad.paymentLinks.getOne("LINK_001");
console.log(link.data.hash); // the link slug
```

#### `toggleStatus(id)`

Enable or disable a payment link.

```typescript
await squad.paymentLinks.toggleStatus("LINK_001");
```

---

### `squad.webhooks`

#### Verifying Checkout Webhook Signatures

Squad sends an `x-squad-encrypted-body` header with every webhook. Always validate it before processing. Use `validateWebhook` if you manage the secret key yourself, or `validateCheckoutWebhook` to use the key already configured on the client instance.

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

  // Always check your DB first to avoid processing the same transaction twice
  if (event.Event === "charge_successful") {
    const { transaction_ref, amount, email } = event.Body;
    // Fulfill order, credit wallet, etc.
  }

  // Respond immediately with an acknowledgment
  const ack = squad.webhooks.buildAcknowledgment(event.TransactionRef, 200);
  res.json(ack);
});
```

#### Virtual Account Webhook Validation

```typescript
const isValid = squad.webhooks.validateVirtualAccountWebhook(
  payload,           // parsed webhook body
  signature,         // x-squad-signature header
  "your_secret_key",
);
```

Squad uses two hashing schemes depending on the webhook version:

| Version | Hash input |
|---------|-----------|
| v1 | Entire JSON body |
| v2/v3 | `transaction_reference\|virtual_account_number\|currency\|principal_amount\|settled_amount\|customer_identifier` |

#### `buildAcknowledgment(transaction_reference, status?)`

Build the required response Squad expects after receiving a webhook.

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
    console.error(err.message);     // human-readable message from Squad
    console.error(err.statusCode);  // HTTP status code
    console.error(err.data);        // raw Squad API error body
  }
}
```

### Error Reference

| Scenario | `statusCode` | Example `message` |
|----------|-------------|-------------------|
| Invalid request payload | `400` | `"Invalid transaction reference"` |
| Missing or bad API key | `401` | `"Unauthorized"` |
| Wrong environment key | `403` | `"API key is invalid. Key must start with sandbox_sk_"` |
| Request timeout | `408` | `"Request timed out"` |
| Transfer timeout | `424` | `"Transaction timed out"` |
| Network failure | `0` | `"Network error — check your connection"` |

---

## TypeScript Usage

All request/response types are exported and can be imported directly:

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
} from "squad-ts";
```

### Typed Webhook Handlers

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

Copy `.env.example` to `.env` and fill in your keys:

```env
SQUAD_SECRET_KEY=sandbox_sk_your_key_here
SQUAD_ENVIRONMENT=sandbox
```

Then load with `dotenv`:

```typescript
import { Squad } from "squad-ts";
import "dotenv/config";

const squad = new Squad({
  secretKey: process.env.SQUAD_SECRET_KEY!,
  environment: (process.env.SQUAD_ENVIRONMENT as "sandbox" | "live") ?? "sandbox",
});
```

---

## Key Business Rules

1. **Transfer references** must be prefixed with your merchant ID — e.g. `"MERCHANTID_uniqueref"`. Squad uses this to namespace your transactions.
2. **424 on transfers** — always call `requery()` before retrying. The transfer may have succeeded despite the timeout. Never retry with the same reference without checking first.
3. **Account lookup before transfer** — always call `accountLookup()` first and pass its `account_name` result into `initiateTransfer`. Squad validates the name.
4. **Idempotent webhook handling** — store processed `transaction_ref` values and check before fulfilling orders. Webhooks can be delivered more than once.
5. **BVN validation on virtual accounts** — name, DOB, gender, and phone must exactly match the BVN record. Mismatches will be rejected.
6. **getAllTransactions date range** — `start_date` and `end_date` are required and the gap must not exceed one month.

---

## Webhook IP Allowlist

Squad sends webhooks exclusively from:

```
18.133.63.109
```

Configure your firewall or server to accept inbound requests from this IP on your webhook endpoint path.

---

## Contributing

Contributions are welcome. This section covers everything you need to get from zero to a merged PR.

### Getting Started

```bash
git clone https://github.com/PADARLabs/squad-ts.git
cd squad-ts
npm install
```

Copy the example env file and add your sandbox credentials:

```bash
cp .env.example .env
# Edit .env and set SQUAD_SECRET_KEY=sandbox_sk_...
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run the full test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run build` | Compile to `dist/` (ESM + CJS + types) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |

### Project Structure

```
src/
  client.ts        # Base HTTP client (fetch-based)
  errors.ts        # SquadError class
  index.ts         # Public exports
  resources/       # One file per API resource
  types/           # TypeScript interfaces for all payloads and responses
tests/
  *.test.ts        # Jest tests per resource (fetch is mocked via jest.spyOn)
```

### How to Add a New Endpoint

1. Add the request/response types to the relevant file in `src/types/`
2. Add the method to the resource class in `src/resources/`
3. Export any new types from `src/types/index.ts`
4. Add a test in `tests/` using `mockFetch()` from `tests/helpers.ts`
5. Add usage docs to `README.md`

### Pull Request Guidelines

- **One PR per feature or fix** — keep changes focused
- **Tests are required** — all new methods need at least a success case and an error case
- **No new dependencies** — the SDK is intentionally zero-dependency; raise an issue first if you think one is needed
- **Match existing code style** — Prettier and ESLint configs are included; run `npm run format && npm run lint:fix` before pushing
- **Update the README** — if you add or change a method, update the API Reference section

### Reporting Issues

Please [open an issue](https://github.com/PADARLabs/squad-ts/issues) for:
- Missing or undocumented API endpoints
- Type errors or incorrect response shapes
- Bugs or unexpected behaviour

Include the Squad API endpoint, the SDK method you called, and the error or unexpected response you received.

---

## License

MIT © [PADARLabs](https://www.padarlabs.com)

See [LICENSE](LICENSE) for the full text.
