import { query } from "../../db/pool.js";
import AppError from "../../utils/AppError.js";

const toCategory = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  taskCount: row.task_count ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const SELECT_WITH_COUNT = `
  SELECT c.*, COUNT(t.id)::int AS task_count
  FROM categories c
  LEFT JOIN tasks t ON t.category_id = c.id
`;

export const assertOwnedCategory = async (db, userId, categoryId) => {
  const { rows } = await db.query("SELECT id FROM categories WHERE id = $1 AND user_id = $2", [categoryId, userId]);
  if (!rows[0]) throw AppError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
};

export const list = async (userId) => {
  const { rows } = await query(
    `${SELECT_WITH_COUNT} WHERE c.user_id = $1 GROUP BY c.id ORDER BY c.created_at ASC`,
    [userId]
  );
  return rows.map(toCategory);
};

export const getById = async (userId, categoryId) => {
  const { rows } = await query(`${SELECT_WITH_COUNT} WHERE c.id = $1 AND c.user_id = $2 GROUP BY c.id`, [
    categoryId,
    userId,
  ]);
  if (!rows[0]) throw AppError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
  return toCategory(rows[0]);
};

export const create = async (userId, { name, description }) => {
  const { rows } = await query(
    "INSERT INTO categories (user_id, name, description) VALUES ($1, $2, $3) RETURNING *",
    [userId, name, description]
  );
  return toCategory(rows[0]);
};

export const update = async (userId, categoryId, changes) => {
  const { rows } = await query(
    `UPDATE categories
     SET name = COALESCE($3, name),
         description = COALESCE($4, description),
         updated_at = now()
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [categoryId, userId, changes.name ?? null, changes.description ?? null]
  );
  if (!rows[0]) throw AppError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
  return getById(userId, categoryId);
};

export const remove = async (userId, categoryId) => {
  const { rowCount } = await query("DELETE FROM categories WHERE id = $1 AND user_id = $2", [categoryId, userId]);
  if (rowCount === 0) throw AppError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
};
