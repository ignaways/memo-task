import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  const result = await authService.register(req.valid.body);
  res.status(201).json({ data: result });
};

export const login = async (req, res) => {
  const result = await authService.login(req.valid.body);
  res.json({ data: result });
};

export const me = async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({ data: user });
};
