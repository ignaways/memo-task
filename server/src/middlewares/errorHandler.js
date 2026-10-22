import { ZodError } from "zod";
import AppError from "../utils/AppError.js";
import { isProduction } from "../config/env.js";

const PG_ERRORS = {
  "23505": () => AppError.conflict("Data sudah ada.", "DUPLICATE"),
  "23503": () => AppError.badRequest("Relasi data tidak valid.", "INVALID_REFERENCE"),
  "23514": () => AppError.badRequest("Nilai data tidak valid.", "CHECK_VIOLATION"),
  "22001": () => AppError.badRequest("Teks terlalu panjang.", "VALUE_TOO_LONG"),
};

const normalizeError = (error) => {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return AppError.badRequest("Data yang dikirim tidak valid.", "VALIDATION_ERROR", details);
  }

  if (error.type === "entity.parse.failed") return AppError.badRequest("Body JSON tidak valid.", "INVALID_JSON");
  if (error.type === "entity.too.large") return new AppError(413, "PAYLOAD_TOO_LARGE", "Ukuran data terlalu besar.");
  if (error.code && PG_ERRORS[error.code]) return PG_ERRORS[error.code]();

  return null;
};

export function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: `Endpoint ${req.method} ${req.path} tidak ditemukan.` } });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const appError = normalizeError(error);

  if (!appError) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Terjadi kesalahan pada server.",
        ...(isProduction ? {} : { debug: error.message }),
      },
    });
  }

  res.status(appError.status).json({
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
    },
  });
}
