import request from "supertest";

const required = ["DATABASE_URL", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Tes membutuhkan ${missing.join(", ")}. Salin .env.test.example menjadi .env.test.`);
}
if (!/test/i.test(process.env.DATABASE_URL)) {
  throw new Error("DATABASE_URL untuk tes harus mengarah ke database khusus tes (nama mengandung 'test').");
}

process.env.NODE_ENV = "test";

const { createApp } = await import("../src/app.js");
const { pool } = await import("../src/db/pool.js");
const { runMigrations } = await import("../src/db/migrate.js");

export const app = createApp();
export { pool };

export const setupDatabase = async () => {
  await runMigrations({ log: () => {} });
  await pool.query("TRUNCATE users RESTART IDENTITY CASCADE");
};

let counter = 0;

export const createUser = async (overrides = {}) => {
  counter += 1;
  const payload = {
    name: `User ${counter}`,
    email: `user${counter}-${Date.now()}@example.com`,
    password: "rahasia123",
    ...overrides,
  };
  const res = await request(app).post("/api/auth/register").send(payload);
  return { ...res.body.data, password: payload.password };
};

export const api = (token) => {
  const withAuth = (req) => (token ? req.set("Authorization", `Bearer ${token}`) : req);
  return {
    get: (url) => withAuth(request(app).get(url)),
    post: (url, body) => withAuth(request(app).post(url)).send(body),
    patch: (url, body) => withAuth(request(app).patch(url)).send(body),
    delete: (url) => withAuth(request(app).delete(url)),
  };
};
