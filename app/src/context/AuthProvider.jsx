import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";
import { setUnauthorizedHandler } from "../services/apiClient";
import { tokenStorage } from "../utils/tokenStorage";
import useToast from "../hooks/useToast";

export const AUTH_STATUS = {
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  GUEST: "guest",
  ERROR: "error",
};

export default function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (tokenStorage.get() ? AUTH_STATUS.CHECKING : AUTH_STATUS.GUEST));

  const startSession = useCallback(({ token, user: nextUser }) => {
    tokenStorage.set(token);
    setUser(nextUser);
    setStatus(AUTH_STATUS.AUTHENTICATED);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus(AUTH_STATUS.GUEST);
  }, []);

  const checkSession = useCallback(async () => {
    if (!tokenStorage.get()) {
      setStatus(AUTH_STATUS.GUEST);
      return;
    }

    setStatus(AUTH_STATUS.CHECKING);
    try {
      setUser(await authService.me());
      setStatus(AUTH_STATUS.AUTHENTICATED);
    } catch (error) {
      if (error.status === 401) {
        logout();
      } else {
        setStatus(AUTH_STATUS.ERROR);
      }
    }
  }, [logout]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      toast.error("Sesi kamu berakhir, silakan login kembali.");
    });
    return () => setUnauthorizedHandler(null);
  }, [logout, toast]);

  const login = useCallback(async (credentials) => startSession(await authService.login(credentials)), [startSession]);

  const register = useCallback(async (payload) => startSession(await authService.register(payload)), [startSession]);

  const value = useMemo(
    () => ({ user, status, login, register, logout, retry: checkSession }),
    [user, status, login, register, logout, checkSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
