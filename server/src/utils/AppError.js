export default class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message, code = "BAD_REQUEST", details) {
    return new AppError(400, code, message, details);
  }

  static unauthorized(message = "Silakan login terlebih dahulu.", code = "UNAUTHORIZED") {
    return new AppError(401, code, message);
  }

  static notFound(message = "Data tidak ditemukan.", code = "NOT_FOUND") {
    return new AppError(404, code, message);
  }

  static conflict(message, code = "CONFLICT") {
    return new AppError(409, code, message);
  }
}
