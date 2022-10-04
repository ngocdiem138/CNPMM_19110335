module.exports = class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    // maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.message = message;
    this.name = this.constructor.name;
    this.status = status;
  }
};
