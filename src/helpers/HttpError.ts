export class HttpError extends Error {
  status: number;

  details: Record<string, unknown>;

  constructor(status: number, message: string, details = {}) {
    super(message);

    this.status = status;
    this.details = details;
  }
}

export default HttpError;
