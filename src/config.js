// Central runtime configuration, read once from the environment.
export const API_URL =
  process.env.REACT_APP_API_URL || "https://attsystem-latest.onrender.com";

// "auto" | "mock" | "live"  (see .env.example)
export const DATA_MODE = process.env.REACT_APP_DATA_MODE || "auto";

export const ALWAYS_MOCK = DATA_MODE === "mock";
export const NEVER_FALLBACK = DATA_MODE === "live";

// Demo credentials used when the app runs against bundled data (backend offline).
export const DEMO_CREDENTIALS = {
  staffId: "Staff001",
  password: "Password123!",
};

export const ROLES = {
  A1: "Super Administrator",
  B2: "Sub Administrator",
  C3: "Staff",
};

export const roleLabel = (role) => ROLES[role] || "Staff";
