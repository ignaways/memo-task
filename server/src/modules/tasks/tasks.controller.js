import * as taskService from "./tasks.service.js";

export const listByCategory = async (req, res) => {
  const tasks = await taskService.listByCategory(req.user.id, req.valid.params.categoryId);
  res.json({ data: tasks });
};

export const create = async (req, res) => {
  const task = await taskService.create(req.user.id, req.valid.params.categoryId, req.valid.body);
  res.status(201).json({ data: task });
};

export const update = async (req, res) => {
  const task = await taskService.update(req.user.id, req.valid.params.taskId, req.valid.body);
  res.json({ data: task });
};

export const move = async (req, res) => {
  const task = await taskService.move(req.user.id, req.valid.params.taskId, req.valid.body);
  res.json({ data: task });
};

export const toggleChecklistItem = async (req, res) => {
  const { taskId, itemId } = req.valid.params;
  const item = await taskService.toggleChecklistItem(req.user.id, taskId, itemId, req.valid.body.done);
  res.json({ data: item });
};

export const remove = async (req, res) => {
  await taskService.remove(req.user.id, req.valid.params.taskId);
  res.status(204).end();
};
