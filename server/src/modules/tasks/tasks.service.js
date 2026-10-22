import { query, withTransaction } from "../../db/pool.js";
import AppError from "../../utils/AppError.js";
import { assertOwnedCategory } from "../categories/categories.service.js";

const SELECT_TASK = `
  SELECT t.*,
    COALESCE(
      json_agg(
        json_build_object('id', c.id, 'text', c.text, 'done', c.done)
        ORDER BY c.position
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'
    ) AS checklist
  FROM tasks t
  LEFT JOIN checklist_items c ON c.task_id = t.id
`;

const COLUMN_MAP = {
  title: "title",
  description: "description",
  priority: "priority",
  deadline: "deadline",
  tags: "tags",
};

const toTask = (row) => ({
  id: row.id,
  categoryId: row.category_id,
  title: row.title,
  description: row.description,
  status: row.status,
  priority: row.priority,
  deadline: row.deadline,
  tags: row.tags,
  checklist: row.checklist,
  position: row.position,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const taskNotFound = () => AppError.notFound("Task tidak ditemukan.", "TASK_NOT_FOUND");

const fetchTask = async (db, userId, taskId) => {
  const { rows } = await db.query(`${SELECT_TASK} WHERE t.id = $1 AND t.user_id = $2 GROUP BY t.id`, [taskId, userId]);
  if (!rows[0]) throw taskNotFound();
  return toTask(rows[0]);
};

const lockTask = async (db, userId, taskId) => {
  const { rows } = await db.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2 FOR UPDATE", [taskId, userId]);
  if (!rows[0]) throw taskNotFound();
  return rows[0];
};

const replaceChecklist = async (db, taskId, items) => {
  await db.query("DELETE FROM checklist_items WHERE task_id = $1", [taskId]);
  if (items.length === 0) return;

  await db.query(
    `INSERT INTO checklist_items (id, task_id, text, done, position)
     SELECT COALESCE(item.id, gen_random_uuid()), $1, item.text, item.done, item.position - 1
     FROM unnest($2::uuid[], $3::text[], $4::boolean[]) WITH ORDINALITY AS item(id, text, done, position)`,
    [taskId, items.map((item) => item.id ?? null), items.map((item) => item.text), items.map((item) => item.done)]
  );
};

export const listByCategory = async (userId, categoryId) => {
  await assertOwnedCategory({ query }, userId, categoryId);
  const { rows } = await query(
    `${SELECT_TASK} WHERE t.category_id = $1 AND t.user_id = $2 GROUP BY t.id ORDER BY t.position, t.created_at`,
    [categoryId, userId]
  );
  return rows.map(toTask);
};

export const create = async (userId, categoryId, data) =>
  withTransaction(async (db) => {
    await assertOwnedCategory(db, userId, categoryId);

    const { rows } = await db.query(
      `INSERT INTO tasks (user_id, category_id, title, description, priority, deadline, tags, status, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new',
         (SELECT COALESCE(MAX(position) + 1, 0) FROM tasks WHERE category_id = $2 AND status = 'new'))
       RETURNING id`,
      [userId, categoryId, data.title, data.description, data.priority, data.deadline, data.tags]
    );

    const taskId = rows[0].id;
    await replaceChecklist(db, taskId, data.checklist.map(({ id, ...item }) => item));
    return fetchTask(db, userId, taskId);
  });

export const update = async (userId, taskId, changes) =>
  withTransaction(async (db) => {
    await lockTask(db, userId, taskId);

    const entries = Object.entries(changes).filter(([key]) => COLUMN_MAP[key]);
    if (entries.length > 0) {
      const assignments = entries.map(([key], index) => `${COLUMN_MAP[key]} = $${index + 3}`);
      await db.query(
        `UPDATE tasks SET ${assignments.join(", ")}, updated_at = now() WHERE id = $1 AND user_id = $2`,
        [taskId, userId, ...entries.map(([, value]) => value)]
      );
    }

    if (changes.checklist) {
      await replaceChecklist(db, taskId, changes.checklist);
      if (entries.length === 0) await db.query("UPDATE tasks SET updated_at = now() WHERE id = $1", [taskId]);
    }

    return fetchTask(db, userId, taskId);
  });

export const move = async (userId, taskId, { status, beforeId }) =>
  withTransaction(async (db) => {
    const task = await lockTask(db, userId, taskId);

    if (beforeId === taskId) throw AppError.badRequest("beforeId tidak boleh sama dengan task yang dipindah.", "INVALID_POSITION");

    const { rows } = await db.query(
      `SELECT id FROM tasks
       WHERE category_id = $1 AND status = $2 AND id <> $3
       ORDER BY position, created_at
       FOR UPDATE`,
      [task.category_id, status, taskId]
    );

    const ids = rows.map((row) => row.id);
    const beforeIndex = beforeId ? ids.indexOf(beforeId) : -1;
    ids.splice(beforeIndex === -1 ? ids.length : beforeIndex, 0, taskId);

    await db.query(
      `UPDATE tasks AS t
       SET position = ordered.position - 1,
           status = $2,
           updated_at = CASE WHEN t.id = $3 THEN now() ELSE t.updated_at END
       FROM unnest($1::uuid[]) WITH ORDINALITY AS ordered(id, position)
       WHERE t.id = ordered.id`,
      [ids, status, taskId]
    );

    return fetchTask(db, userId, taskId);
  });

export const toggleChecklistItem = async (userId, taskId, itemId, done) => {
  const { rows } = await query(
    `UPDATE checklist_items AS c
     SET done = $4
     FROM tasks t
     WHERE c.id = $3 AND c.task_id = $2 AND t.id = c.task_id AND t.user_id = $1
     RETURNING c.id, c.text, c.done`,
    [userId, taskId, itemId, done]
  );
  if (!rows[0]) throw AppError.notFound("Item checklist tidak ditemukan.", "CHECKLIST_ITEM_NOT_FOUND");
  return rows[0];
};

export const remove = async (userId, taskId) => {
  const { rowCount } = await query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [taskId, userId]);
  if (rowCount === 0) throw taskNotFound();
};
