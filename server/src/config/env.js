import { z } from "zod";

const booleanString = z
  .enum(["true", "false", "1", "0"])
  .optional()
  .transform((value) => value === "true" || value === "1");

const normalizeOrigin = (value) => {
  const trimmed = value.trim().replace(/\/+$/, "");
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  DATABASE_SSL: booleanString,
  JWT_SECRET: z.string().min(32, "JWT_SECRET minimal 32 karakter"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(15).default(10),
  CLIENT_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .transform((value) => value.split(",").filter(Boolean).map(normalizeOrigin)),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`).join("\n");
  console.error(`Konfigurasi environment tidak valid:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
