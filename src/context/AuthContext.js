import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getCurrentUser,
  saveSession,
  clearSession,
  safeDecode,
} from "../auth/session";
import { authService } from "../api/services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());

  const login = useCallback(async ({ staffId, password }) => {
    const { token } = await authService.login({ staffId, password });
    const decoded = safeDecode(token) || {};
    const session = {
      token,
      roleID: decoded.LabRole || null,
      nameID: decoded.nameid || staffId,
    };
    saveSession(session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    roleID: user?.roleID || null,
    nameID: user?.nameID || "",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
