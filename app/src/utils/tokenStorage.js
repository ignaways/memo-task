const KEY = "memo-board.token";

export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(KEY, token);
    } catch {
      return;
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      return;
    }
  },
};
