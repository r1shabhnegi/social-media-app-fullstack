class ApiError extends Error {
  statusCode: number;
  errorCode: number;

  constructor(errorCode: number, message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export { ApiError };
