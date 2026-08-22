import axios from "axios";
import { API_URL } from "../config";
import { getToken, clearSession } from "../auth/session";

// Single axios instance for the whole app.
const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token to every outgoing request.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On an expired/rejected session, clear it and bounce to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession();
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }
    return Promise.reject(error);
  }
);

// True when the failure means "backend unreachable" rather than a real HTTP error
// (network down, timeout, or a 5xx such as the current 503).
export const isUnreachable = (error) => {
  if (!error) return false;
  if (error.code === "ECONNABORTED") return true; // timeout
  if (!error.response) return true; // network / CORS / DNS
  return error.response.status >= 500;
};

export default client;
