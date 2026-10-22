import { Router } from "express";
import * as controller from "./tasks.controller.js";
import {
  checklistItemParamsSchema,
  moveTaskSchema,
  taskParamsSchema,
  toggleChecklistSchema,
  updateTaskSchema,
} from "./tasks.schema.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.patch("/:taskId", validate({ params: taskParamsSchema, body: updateTaskSchema }), controller.update);
router.delete("/:taskId", validate({ params: taskParamsSchema }), controller.remove);
router.patch("/:taskId/move", validate({ params: taskParamsSchema, body: moveTaskSchema }), controller.move);
router.patch(
  "/:taskId/checklist/:itemId",
  validate({ params: checklistItemParamsSchema, body: toggleChecklistSchema }),
  controller.toggleChecklistItem
);

export default router;
