import * as categoryService from "./categories.service.js";

export const list = async (req, res) => {
  const categories = await categoryService.list(req.user.id);
  res.json({ data: categories });
};

export const getById = async (req, res) => {
  const category = await categoryService.getById(req.user.id, req.valid.params.categoryId);
  res.json({ data: category });
};

export const create = async (req, res) => {
  const category = await categoryService.create(req.user.id, req.valid.body);
  res.status(201).json({ data: category });
};

export const update = async (req, res) => {
  const category = await categoryService.update(req.user.id, req.valid.params.categoryId, req.valid.body);
  res.json({ data: category });
};

export const remove = async (req, res) => {
  await categoryService.remove(req.user.id, req.valid.params.categoryId);
  res.status(204).end();
};
