// Session storage helpers + safe JWT decoding, in one place.
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const ROLE_KEY = "roleID";
const NAME_KEY = "nameID";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const saveSession = ({ token, roleID, nameID }) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  if (roleID) sessionStorage.setItem(ROLE_KEY, roleID);
  if (nameID) sessionStorage.setItem(NAME_KEY, nameID);
};

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(NAME_KEY);
};

// Decode a JWT without ever throwing. Returns null on any problem.
export const safeDecode = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

// Reconstruct the current user from the stored token (falling back to
// the mirrored role/name keys for tokens minted in demo mode).
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = safeDecode(token);

  // Reject expired tokens.
  if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
    clearSession();
    return null;
  }

  return {
    token,
    roleID: decoded?.LabRole || sessionStorage.getItem(ROLE_KEY) || null,
    nameID: decoded?.nameid || sessionStorage.getItem(NAME_KEY) || "",
  };
};
