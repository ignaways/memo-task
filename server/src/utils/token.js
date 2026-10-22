import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (user) =>
  jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN, algorithm: "HS256" });

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
