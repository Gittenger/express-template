class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //programming errors won't have this, trusted errors created using "AppError" class are explicitly created in code

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
