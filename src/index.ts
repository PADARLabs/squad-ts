import type { SquadClientConfig, Environment } from "./client.js";
import { Payments } from "./resources/payments.js";
import { Transfers } from "./resources/transfers.js";
import { VirtualAccounts } from "./resources/virtualAccounts.js";
import { Recurring } from "./resources/recurring.js";
import { Refunds } from "./resources/refunds.js";
import { Disputes } from "./resources/disputes.js";
import { Vas } from "./resources/vas.js";
import { PaymentLinks } from "./resources/paymentLinks.js";
import { Webhooks } from "./resources/webhooks.js";
import { DirectDebit } from "./resources/directDebit.js";
import { Aggregator } from "./resources/aggregator.js";
import { Sms } from "./resources/sms.js";

export class Squad {
  public readonly payments: Payments;
  public readonly transfers: Transfers;
  public readonly virtualAccounts: VirtualAccounts;
  public readonly recurring: Recurring;
  public readonly refunds: Refunds;
  public readonly disputes: Disputes;
  public readonly vas: Vas;
  public readonly paymentLinks: PaymentLinks;
  public readonly webhooks: Webhooks;
  public readonly directDebit: DirectDebit;
  public readonly aggregator: Aggregator;
  public readonly sms: Sms;

  constructor(config: SquadClientConfig) {
    this.payments = new Payments(config);
    this.transfers = new Transfers(config);
    this.virtualAccounts = new VirtualAccounts(config);
    this.recurring = new Recurring(config);
    this.refunds = new Refunds(config);
    this.disputes = new Disputes(config);
    this.vas = new Vas(config);
    this.paymentLinks = new PaymentLinks(config);
    this.webhooks = new Webhooks(config);
    this.directDebit = new DirectDebit(config);
    this.aggregator = new Aggregator(config);
    this.sms = new Sms(config);
  }
}

// Re-export everything consumers need
export { SquadError } from "./errors.js";
export { SquadClient } from "./client.js";
export type { SquadClientConfig, Environment };

export * from "./types/index.js";

export { Payments } from "./resources/payments.js";
export { Transfers } from "./resources/transfers.js";
export { VirtualAccounts } from "./resources/virtualAccounts.js";
export { Recurring } from "./resources/recurring.js";
export { Refunds } from "./resources/refunds.js";
export { Disputes } from "./resources/disputes.js";
export { Vas } from "./resources/vas.js";
export { PaymentLinks } from "./resources/paymentLinks.js";
export { Webhooks } from "./resources/webhooks.js";
export { DirectDebit } from "./resources/directDebit.js";
export { Aggregator } from "./resources/aggregator.js";
export { Sms } from "./resources/sms.js";
