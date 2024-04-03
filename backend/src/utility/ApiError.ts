export class ApiError extends Error {
  errorCode: number;
  statusCode: number;

  constructor(message: string, errorCode: number, statusCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
