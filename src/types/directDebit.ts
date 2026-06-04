// ─── Direct Debit / Mandates ──────────────────────────────────────────────────

export interface MandateCustomerIdentity {
  type: "bvn";
  number: string;
}

export interface MandateCustomerInformation {
  identity: MandateCustomerIdentity;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface CreateMandatePayload {
  mandate_type: "emandate";
  amount: number;
  account_number: string;
  bank_code: string;
  description: string;
  start_date: string;
  end_date: string;
  customer_email: string;
  transaction_reference?: string;
  customerInformation: MandateCustomerInformation;
}

export interface MandateTransferDestination {
  bank_name: string;
  account_number: string;
  icon: string | null;
}

export interface CreateMandateData {
  message: string;
  mandate_id: string;
  mandate_type: string;
  debit_type: string;
  status: string;
  approved: boolean;
  ready_to_debit: boolean;
  reference: string;
  account_number: string;
  description: string;
  start_date: string;
  end_date: string;
  date: string;
  transfer_destinations: MandateTransferDestination[];
}

export interface CreateMandateResponse {
  status: number;
  success: boolean;
  message: string;
  data: CreateMandateData;
}

// ─── Debit Mandate ────────────────────────────────────────────────────────────

export interface DebitMandatePayload {
  amount: number;
  mandate_id: string;
  transaction_reference: string;
  narration?: string;
  pass_charge?: boolean;
  customer_email: string;
}

export interface DebitMandateAccount {
  bank_code: string;
  account_name: string;
  account_number: string;
}

export interface DebitMandateData {
  status: string;
  amount: number;
  mandate_id: string;
  transaction_reference: string;
  date: string;
  account: DebitMandateAccount;
}

export interface DebitMandateResponse {
  status: number;
  success: boolean;
  message: string;
  data: DebitMandateData;
}

// ─── Cancel Mandate ───────────────────────────────────────────────────────────

export interface CancelMandatePayload {
  mandateIds: string[];
}

export interface FailedMandate {
  mandateId: string;
  failureReason: string;
}

export interface CancelMandateData {
  canceledMandates: string[];
  failedMandates: FailedMandate[];
}

export interface CancelMandateResponse {
  status: number;
  success: boolean;
  message: string;
  data: CancelMandateData;
}

// ─── Get Mandate ──────────────────────────────────────────────────────────────

export interface MandateRecord {
  start_date: string;
  end_date: string;
  account_number: string;
  account_name: string;
  bankName: string;
  bank: string;
  ready_to_debit: boolean;
  is_approved: boolean;
  status: string;
  merchant_reference: string;
  mandate_type: string;
  debit_type: string;
  merchant_id: string;
  amount: number;
  balance: number;
  total_debited: number;
}

export interface GetMandateResponse {
  status: number;
  success: boolean;
  message: string;
  data: MandateRecord[];
}

// ─── Bank List ────────────────────────────────────────────────────────────────

export interface DirectDebitBank {
  bank_name: string;
  bank_code: string;
  isActive: boolean;
}

export interface GetDirectDebitBanksResponse {
  status: number;
  success: boolean;
  message: string;
  data: DirectDebitBank[];
}
