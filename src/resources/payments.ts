import { SquadClient } from "../client.js";
import type {
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  VerifyTransactionResponse,
  GetAllTransactionsParams,
  GetAllTransactionsResponse,
  VerifyTransactionData,
  ChargePaymentPayload,
  ChargePaymentResponse,
  AuthorizePaymentPayload,
  ValidatePaymentPayload,
  ChargeTokenizedCardPayload,
  CancelChargeCardPayload,
  CancelChargeCardResponse,
} from "../types/index.js";

export class Payments extends SquadClient {
  async initiate(payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> {
    return this.post<InitiatePaymentResponse>("/transaction/initiate", payload);
  }

  async verify(transactionRef: string): Promise<VerifyTransactionResponse> {
    return this.get<VerifyTransactionResponse>(
      `/transaction/verify/${encodeURIComponent(transactionRef)}`,
    );
  }

  async getTransaction(transactionRef: string): Promise<VerifyTransactionData> {
    const response = await this.verify(transactionRef);
    return response.data;
  }

  async getAllTransactions(
    params: GetAllTransactionsParams,
  ): Promise<GetAllTransactionsResponse> {
    return this.get<GetAllTransactionsResponse>("/transaction", { params });
  }

  async verifyPos(transactionReference: string): Promise<VerifyTransactionResponse> {
    return this.get<VerifyTransactionResponse>(
      `/softpos/transaction/verify/${encodeURIComponent(transactionReference)}`,
    );
  }

  async charge(payload: ChargePaymentPayload): Promise<ChargePaymentResponse> {
    return this.post<ChargePaymentResponse>(
      "/transaction/initiate/process-payment",
      payload,
    );
  }

  async authorize(payload: AuthorizePaymentPayload): Promise<ChargePaymentResponse> {
    return this.post<ChargePaymentResponse>("/transaction/payment/authorize", payload);
  }

  async validatePayment(payload: ValidatePaymentPayload): Promise<ChargePaymentResponse> {
    return this.post<ChargePaymentResponse>("/transaction/validate-payment", payload);
  }

  async chargeCard(payload: ChargeTokenizedCardPayload): Promise<ChargePaymentResponse> {
    return this.post<ChargePaymentResponse>("/transaction/charge_card", payload);
  }

  async cancelChargeCard(payload: CancelChargeCardPayload): Promise<CancelChargeCardResponse> {
    return this.patch<CancelChargeCardResponse>("/transaction/cancel/recurring", payload);
  }
}
