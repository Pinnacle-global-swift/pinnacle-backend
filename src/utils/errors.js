export class ValidationError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = statusCode;
    }
  }
  
  export class TransactionError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.name = 'TransactionError';
      this.statusCode = statusCode;
    }
  }