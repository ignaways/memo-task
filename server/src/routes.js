import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import authenticate from "./middlewares/authenticate.js";
import { query } from "./db/pool.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ok", database: "up", uptime: Math.round(process.uptime()) });
  } catch {
    res.status(503).json({ status: "degraded", database: "down" });
  }
});

router.use("/auth", authRoutes);
router.use("/categories", authenticate, categoryRoutes);
router.use("/tasks", authenticate, taskRoutes);

export default router;
