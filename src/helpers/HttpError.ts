export class HttpError {
  message: string;
  status: number;
  details: Record<string, any>;

  constructor(status: number, message: string, details = {}) {
    this.message = message;
    this.status = status;
    this.details = details;
  }
}

export default HttpError;
