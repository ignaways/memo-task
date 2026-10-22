import bcrypt from "bcryptjs";
import { pool, withTransaction } from "../src/db/pool.js";
import { runMigrations } from "../src/db/migrate.js";
import { env } from "../src/config/env.js";

const DEMO_USER = {
  name: process.env.SEED_USER_NAME ?? "Ignaway",
  email: process.env.SEED_USER_EMAIL ?? "demo@memoboard.dev",
  password: process.env.SEED_USER_PASSWORD ?? "demo12345",
};

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const CATEGORIES = [
  {
    name: "Perkuliahan",
    description: "Task perkuliahan semester ganjil 2026/2027",
    tasks: [
      {
        title: "Tugas makalah Basis Data",
        description: "Membahas normalisasi database sampai bentuk BCNF beserta contoh kasus.",
        status: "new",
        priority: "high",
        deadline: addDays(2),
        tags: ["basis-data", "makalah"],
        checklist: [
          ["Cari referensi jurnal", true],
          ["Susun kerangka makalah", false],
          ["Buat contoh kasus normalisasi", false],
        ],
      },
      {
        title: "Belajar untuk kuis Algoritma",
        description: "Materi sorting dan searching.",
        status: "new",
        priority: "medium",
        deadline: addDays(5),
        tags: ["algoritma"],
        checklist: [],
      },
      {
        title: "Project UI/UX aplikasi kampus",
        description: "Membuat wireframe dan prototype di Figma.",
        status: "progress",
        priority: "high",
        deadline: addDays(-1),
        tags: ["ui-ux", "project"],
        checklist: [
          ["Wireframe low fidelity", true],
          ["Prototype high fidelity", false],
        ],
      },
      {
        title: "Kumpulkan laporan praktikum Jaringan",
        description: "",
        status: "complete",
        priority: "low",
        deadline: addDays(-3),
        tags: ["jaringan"],
        checklist: [],
      },
    ],
  },
  {
    name: "Deadline",
    description: "Deadline kerjaan bulan Oktober",
    tasks: [
      {
        title: "Refactor modul autentikasi",
        description: "Pisahkan logic token ke service tersendiri dan tambahkan refresh token.",
        status: "progress",
        priority: "high",
        deadline: addDays(0),
        tags: ["backend", "security"],
        checklist: [
          ["Buat token service", true],
          ["Implementasi refresh token", false],
          ["Update unit test", false],
        ],
      },
      {
        title: "Rapat sprint planning",
        description: "Siapkan daftar backlog dan estimasi story point.",
        status: "new",
        priority: "medium",
        deadline: addDays(3),
        tags: ["meeting", "planning"],
        checklist: [],
      },
      {
        title: "Deploy landing page",
        description: "Landing page sudah live di production.",
        status: "complete",
        priority: "medium",
        deadline: addDays(-2),
        tags: ["frontend", "deploy"],
        checklist: [],
      },
    ],
  },
];

const seed = async () => {
  await runMigrations();

  await withTransaction(async (db) => {
    const existing = await db.query("SELECT id FROM users WHERE lower(email) = lower($1)", [DEMO_USER.email]);
    if (existing.rows[0]) {
      console.log(`Akun ${DEMO_USER.email} sudah ada, seed dilewati.`);
      return;
    }

    const passwordHash = await bcrypt.hash(DEMO_USER.password, env.BCRYPT_ROUNDS);
    const { rows } = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [DEMO_USER.name, DEMO_USER.email, passwordHash]
    );
    const userId = rows[0].id;

    for (const category of CATEGORIES) {
      const created = await db.query(
        "INSERT INTO categories (user_id, name, description) VALUES ($1, $2, $3) RETURNING id",
        [userId, category.name, category.description]
      );
      const categoryId = created.rows[0].id;
      const positions = {};

      for (const task of category.tasks) {
        positions[task.status] = (positions[task.status] ?? -1) + 1;
        const insertedTask = await db.query(
          `INSERT INTO tasks (user_id, category_id, title, description, status, priority, deadline, tags, position)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [userId, categoryId, task.title, task.description, task.status, task.priority, task.deadline, task.tags, positions[task.status]]
        );

        for (const [index, [text, done]] of task.checklist.entries()) {
          await db.query("INSERT INTO checklist_items (task_id, text, done, position) VALUES ($1, $2, $3, $4)", [
            insertedTask.rows[0].id,
            text,
            done,
            index,
          ]);
        }
      }
    }

    console.log(`Seed selesai. Login dengan ${DEMO_USER.email} / ${DEMO_USER.password}`);
  });
};

seed()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
