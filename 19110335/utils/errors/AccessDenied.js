const AppError = require('./AppError');

module.exports = class AccessDenied extends AppError {
  constructor(message) {
    super(message, 403);
  }
};
