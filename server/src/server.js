import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`memo-board-api berjalan di port ${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal) => {
  console.log(`${signal} diterima, menutup server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
