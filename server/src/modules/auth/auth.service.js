import bcrypt from "bcryptjs";
import { query } from "../../db/pool.js";
import { env } from "../../config/env.js";
import AppError from "../../utils/AppError.js";
import { signToken } from "../../utils/token.js";

const DUMMY_HASH = bcrypt.hashSync("memo-board-timing-guard", 10);

const toUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: row.created_at,
});

const withToken = (user) => ({ token: signToken(user), user });

export const register = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

  try {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );
    return withToken(toUser(rows[0]));
  } catch (error) {
    if (error.code === "23505") throw AppError.conflict("Email sudah terdaftar.", "EMAIL_TAKEN");
    throw error;
  }
};

export const login = async ({ email, password }) => {
  const { rows } = await query(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE lower(email) = lower($1)",
    [email]
  );
  const user = rows[0];
  const isValid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !isValid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email atau password salah.");
  }

  return withToken(toUser(user));
};

export const getProfile = async (userId) => {
  const { rows } = await query("SELECT id, name, email, created_at FROM users WHERE id = $1", [userId]);
  if (!rows[0]) throw AppError.unauthorized("Akun tidak ditemukan, silakan login kembali.", "USER_NOT_FOUND");
  return toUser(rows[0]);
};
