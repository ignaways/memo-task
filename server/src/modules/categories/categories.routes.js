import { Router } from "express";
import * as controller from "./categories.controller.js";
import * as taskController from "../tasks/tasks.controller.js";
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from "./categories.schema.js";
import { createTaskSchema } from "../tasks/tasks.schema.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.get("/", controller.list);
router.post("/", validate({ body: createCategorySchema }), controller.create);
router.get("/:categoryId", validate({ params: categoryParamsSchema }), controller.getById);
router.patch("/:categoryId", validate({ params: categoryParamsSchema, body: updateCategorySchema }), controller.update);
router.delete("/:categoryId", validate({ params: categoryParamsSchema }), controller.remove);

router.get("/:categoryId/tasks", validate({ params: categoryParamsSchema }), taskController.listByCategory);
router.post(
  "/:categoryId/tasks",
  validate({ params: categoryParamsSchema, body: createTaskSchema }),
  taskController.create
);

export default router;
