import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { api, createUser, pool, setupDatabase } from "./helpers.js";

before(setupDatabase);
after(() => pool.end());

describe("Auth", () => {
  test("register mengembalikan token dan user tanpa password", async () => {
    const res = await api().post("/api/auth/register", {
      name: "Andri",
      email: "Andri@Example.com",
      password: "rahasia123",
    });

    assert.equal(res.status, 201);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.email, "andri@example.com");
    assert.equal(res.body.data.user.password_hash, undefined);
  });

  test("register menolak email yang sudah dipakai (tidak case sensitive)", async () => {
    const res = await api().post("/api/auth/register", {
      name: "Lain",
      email: "ANDRI@example.com",
      password: "rahasia123",
    });

    assert.equal(res.status, 409);
    assert.equal(res.body.error.code, "EMAIL_TAKEN");
  });

  test("register memvalidasi input", async () => {
    const res = await api().post("/api/auth/register", { name: "", email: "bukan-email", password: "123" });

    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
    const fields = res.body.error.details.map((detail) => detail.field);
    assert.deepEqual(fields.sort(), ["email", "name", "password"]);
  });

  test("login berhasil dengan kredensial yang benar", async () => {
    const res = await api().post("/api/auth/login", { email: "andri@example.com", password: "rahasia123" });

    assert.equal(res.status, 200);
    assert.ok(res.body.data.token);
  });

  test("login gagal dengan password salah", async () => {
    const res = await api().post("/api/auth/login", { email: "andri@example.com", password: "salah12345" });

    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, "INVALID_CREDENTIALS");
  });

  test("me membutuhkan token yang valid", async () => {
    const user = await createUser();

    assert.equal((await api().get("/api/auth/me")).status, 401);
    assert.equal((await api("token-palsu").get("/api/auth/me")).status, 401);

    const res = await api(user.token).get("/api/auth/me");
    assert.equal(res.status, 200);
    assert.equal(res.body.data.id, user.user.id);
  });
});
