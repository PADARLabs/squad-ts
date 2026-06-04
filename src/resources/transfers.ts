import { SquadClient } from "../client.js";
import type {
  AccountLookupPayload,
  AccountLookupResponse,
  InitiateTransferPayload,
  InitiateTransferResponse,
  RequeryTransferPayload,
  RequeryTransferResponse,
  GetAllTransfersParams,
  GetAllTransfersResponse,
  GetBanksResponse,
  GetBalanceResponse,
} from "../types/index.js";

export class Transfers extends SquadClient {
  async accountLookup(payload: AccountLookupPayload): Promise<AccountLookupResponse> {
    return this.post<AccountLookupResponse>("/payout/account/lookup", payload);
  }

  async initiateTransfer(payload: InitiateTransferPayload): Promise<InitiateTransferResponse> {
    return this.post<InitiateTransferResponse>("/payout/transfer", payload);
  }

  async requery(payload: RequeryTransferPayload): Promise<RequeryTransferResponse> {
    return this.post<RequeryTransferResponse>("/payout/requery", payload);
  }

  async getAllTransfers(params: GetAllTransfersParams): Promise<GetAllTransfersResponse> {
    return this.get<GetAllTransfersResponse>("/payout/list", { params });
  }

  async getBanks(): Promise<GetBanksResponse> {
    return this.get<GetBanksResponse>("/payout/banks");
  }

  async getBalance(currency_id: "NGN" = "NGN"): Promise<GetBalanceResponse> {
    return this.get<GetBalanceResponse>("/merchant/balance", { params: { currency_id } });
  }
}
