import { api } from "./apiClient";

export const categoryService = {
  list: () => api.get("/categories"),
  create: (payload) => api.post("/categories", payload),
  update: (id, payload) => api.patch(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
};
