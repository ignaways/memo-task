import { api } from "./apiClient";

export const authService = {
  register: (payload) => api.post("/auth/register", payload, { auth: false }),
  login: (payload) => api.post("/auth/login", payload, { auth: false }),
  me: () => api.get("/auth/me"),
};
