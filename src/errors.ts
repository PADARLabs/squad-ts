export interface SquadErrorData {
  status?: number;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export class SquadError extends Error {
  public readonly statusCode: number;
  public readonly data: SquadErrorData | null;

  constructor(message: string, statusCode: number, data: SquadErrorData | null = null) {
    super(message);
    this.name = "SquadError";
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, SquadError.prototype);
  }
}
