import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./authContextInstance";

const STORAGE_KEYS = Object.freeze({
  user: "user",
  token: "token",
});

const parseStoredUser = (rawUser) => {
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const getInitialAuthState = () => {
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const user = parseStoredUser(rawUser);

  if (!user || !token) {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
    return { user: null, token: null };
  }

  return { user, token };
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const clearSession = useCallback(() => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
  }, []);

  const login = useCallback(
    (userData, authToken) => {
      if (!userData || !authToken) {
        clearSession();
        return;
      }

      setAuthState({ user: userData, token: authToken });
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.token, authToken);
    },
    [clearSession]
  );

  const logout = clearSession;

  const getUserId = useCallback(() => {
    return authState.user ? authState.user.id_usuario || authState.user.id || null : null;
  }, [authState.user]);

  const getUserEmail = useCallback(() => {
    return authState.user?.email || "Anonimo";
  }, [authState.user]);

  const getUserName = useCallback(() => {
    if (!authState.user) return "Anonimo";
    const nombre = String(authState.user.nombre || "").trim();
    const apellido = String(authState.user.apellido || "").trim();
    return `${nombre} ${apellido}`.trim() || "Anonimo";
  }, [authState.user]);

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.user && authState.token),
      login,
      logout,
      getUserId,
      getUserEmail,
      getUserName,
    }),
    [authState.user, authState.token, login, logout, getUserId, getUserEmail, getUserName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
