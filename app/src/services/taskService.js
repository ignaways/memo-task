import { api } from "./apiClient";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const toPayload = ({ title, description, priority, deadline, tags, checklist }) => ({
  title,
  description,
  priority,
  deadline: deadline || null,
  tags,
  checklist: checklist.map(({ id, text, done }) => (UUID_PATTERN.test(id) ? { id, text, done } : { text, done })),
});

export const taskService = {
  listByCategory: (categoryId) => api.get(`/categories/${categoryId}/tasks`),
  create: (categoryId, data) => api.post(`/categories/${categoryId}/tasks`, toPayload(data)),
  update: (id, data) => api.patch(`/tasks/${id}`, toPayload(data)),
  move: (id, status, beforeId) => api.patch(`/tasks/${id}/move`, { status, beforeId: beforeId ?? null }),
  toggleChecklistItem: (taskId, itemId, done) => api.patch(`/tasks/${taskId}/checklist/${itemId}`, { done }),
  remove: (id) => api.delete(`/tasks/${id}`),
};
