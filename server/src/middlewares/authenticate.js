import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/token.js";

export default function authenticate(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) return next(AppError.unauthorized());

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    next(AppError.unauthorized("Sesi berakhir, silakan login kembali.", "INVALID_TOKEN"));
  }
}
