// const { HTTP_STATUS_FORBIDDEN } = require('http2').constants;
const HTTP_STATUS_CONFLICT = 409;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
