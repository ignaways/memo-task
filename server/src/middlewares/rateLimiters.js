import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const message = (text) => ({ error: { code: "TOO_MANY_REQUESTS", message: text } });

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: message("Terlalu banyak permintaan, coba lagi sebentar."),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: message("Terlalu banyak percobaan login, coba lagi dalam 15 menit."),
});
