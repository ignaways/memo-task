import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { api, createUser, pool, setupDatabase } from "./helpers.js";

let owner;
let stranger;
let categoryId;

const titlesByStatus = async (status) => {
  const res = await api(owner.token).get(`/api/categories/${categoryId}/tasks`);
  return res.body.data.filter((task) => task.status === status).map((task) => task.title);
};

const createTask = async (title, extra = {}) => {
  const res = await api(owner.token).post(`/api/categories/${categoryId}/tasks`, { title, ...extra });
  assert.equal(res.status, 201);
  return res.body.data;
};

before(async () => {
  await setupDatabase();
  owner = await createUser();
  stranger = await createUser();
});

after(() => pool.end());

describe("Categories", () => {
  test("membuat dan menampilkan kategori milik user", async () => {
    const created = await api(owner.token).post("/api/categories", {
      name: "  Perkuliahan  ",
      description: "Semester ganjil",
    });

    assert.equal(created.status, 201);
    assert.equal(created.body.data.name, "Perkuliahan");
    assert.equal(created.body.data.taskCount, 0);
    assert.equal(created.body.data.icon, "book");
    assert.equal(created.body.data.color, "#f59e0b");
    categoryId = created.body.data.id;

    const list = await api(owner.token).get("/api/categories");
    assert.equal(list.body.data.length, 1);
  });

  test("user lain tidak bisa melihat atau mengubah kategori", async () => {
    assert.equal((await api(stranger.token).get("/api/categories")).body.data.length, 0);
    assert.equal((await api(stranger.token).get(`/api/categories/${categoryId}`)).status, 404);
    assert.equal((await api(stranger.token).patch(`/api/categories/${categoryId}`, { name: "Hack" })).status, 404);
    assert.equal((await api(stranger.token).get(`/api/categories/${categoryId}/tasks`)).status, 404);
  });

  test("mengubah ikon dan warna kategori", async () => {
    const updated = await api(owner.token).patch(`/api/categories/${categoryId}`, { icon: "code", color: "#0EA5E9" });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.icon, "code");
    assert.equal(updated.body.data.color, "#0ea5e9");

    const emoji = await api(owner.token).patch(`/api/categories/${categoryId}`, { icon: "👨‍💻" });
    assert.equal(emoji.status, 200);
    assert.equal(emoji.body.data.icon, "👨‍💻");
  });

  test("menolak ikon dan warna yang tidak valid", async () => {
    for (const body of [{ icon: "roket" }, { icon: "🚀🚀" }, { icon: "a" }, { color: "amber" }, { color: "#fff" }]) {
      const res = await api(owner.token).post("/api/categories", { name: "Lain", ...body });
      assert.equal(res.status, 400, JSON.stringify(body));
    }
  });

  test("ID tidak valid ditolak dengan 400", async () => {
    const res = await api(owner.token).get("/api/categories/bukan-uuid");
    assert.equal(res.status, 400);
  });
});

describe("Tasks", () => {
  test("membuat task lengkap dengan tag dan checklist", async () => {
    const task = await createTask("Makalah Basis Data", {
      description: "Normalisasi",
      priority: "high",
      deadline: "2026-12-01",
      tags: ["Basis Data", "#makalah", "makalah"],
      checklist: [{ text: "Cari referensi" }, { text: "Kerangka", done: true }],
    });

    assert.equal(task.status, "new");
    assert.equal(task.priority, "high");
    assert.equal(task.deadline, "2026-12-01");
    assert.deepEqual(task.tags, ["basis-data", "makalah"]);
    assert.deepEqual(
      task.checklist.map(({ text, done }) => [text, done]),
      [
        ["Cari referensi", false],
        ["Kerangka", true],
      ]
    );

    const category = await api(owner.token).get(`/api/categories/${categoryId}`);
    assert.equal(category.body.data.taskCount, 1);
  });

  test("memvalidasi priority dan deadline", async () => {
    const res = await api(owner.token).post(`/api/categories/${categoryId}/tasks`, {
      title: "X",
      priority: "urgent",
      deadline: "01-12-2026",
    });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.error.details.map((detail) => detail.field).sort(), ["deadline", "priority"]);
  });

  test("edit task dan ganti checklist", async () => {
    const task = await createTask("Draft", { checklist: [{ text: "Lama" }] });

    const res = await api(owner.token).patch(`/api/tasks/${task.id}`, {
      title: "Final",
      deadline: null,
      checklist: [{ id: task.checklist[0].id, text: "Lama diubah", done: true }, { text: "Baru" }],
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.title, "Final");
    assert.equal(res.body.data.deadline, null);
    assert.equal(res.body.data.checklist[0].id, task.checklist[0].id);
    assert.deepEqual(
      res.body.data.checklist.map(({ text, done }) => [text, done]),
      [
        ["Lama diubah", true],
        ["Baru", false],
      ]
    );
  });

  test("toggle item checklist", async () => {
    const task = await createTask("Checklist", { checklist: [{ text: "Item" }] });
    const itemId = task.checklist[0].id;

    const res = await api(owner.token).patch(`/api/tasks/${task.id}/checklist/${itemId}`, { done: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.done, true);

    const forbidden = await api(stranger.token).patch(`/api/tasks/${task.id}/checklist/${itemId}`, { done: false });
    assert.equal(forbidden.status, 404);
  });

  test("move: pindah kolom dan urutkan atas-bawah", async () => {
    await pool.query("DELETE FROM tasks WHERE category_id = $1", [categoryId]);
    const a = await createTask("A");
    const b = await createTask("B");
    const c = await createTask("C");

    assert.deepEqual(await titlesByStatus("new"), ["A", "B", "C"]);

    await api(owner.token).patch(`/api/tasks/${c.id}/move`, { status: "new", beforeId: a.id });
    assert.deepEqual(await titlesByStatus("new"), ["C", "A", "B"]);

    await api(owner.token).patch(`/api/tasks/${a.id}/move`, { status: "progress", beforeId: null });
    assert.deepEqual(await titlesByStatus("new"), ["C", "B"]);
    assert.deepEqual(await titlesByStatus("progress"), ["A"]);

    await api(owner.token).patch(`/api/tasks/${b.id}/move`, { status: "progress", beforeId: a.id });
    assert.deepEqual(await titlesByStatus("progress"), ["B", "A"]);

    await api(owner.token).patch(`/api/tasks/${c.id}/move`, { status: "new" });
    assert.deepEqual(await titlesByStatus("new"), ["C"]);
  });

  test("move menolak status tidak valid dan task milik user lain", async () => {
    const task = await createTask("Milik owner");

    assert.equal((await api(owner.token).patch(`/api/tasks/${task.id}/move`, { status: "done" })).status, 400);
    assert.equal((await api(stranger.token).patch(`/api/tasks/${task.id}/move`, { status: "complete" })).status, 404);
  });

  test("hapus task dan kategori (cascade)", async () => {
    const task = await createTask("Hapus saya");

    assert.equal((await api(stranger.token).delete(`/api/tasks/${task.id}`)).status, 404);
    assert.equal((await api(owner.token).delete(`/api/tasks/${task.id}`)).status, 204);
    assert.equal((await api(owner.token).delete(`/api/tasks/${task.id}`)).status, 404);

    assert.equal((await api(owner.token).delete(`/api/categories/${categoryId}`)).status, 204);
    const { rows } = await pool.query("SELECT count(*)::int AS total FROM tasks WHERE category_id = $1", [categoryId]);
    assert.equal(rows[0].total, 0);
  });
});
