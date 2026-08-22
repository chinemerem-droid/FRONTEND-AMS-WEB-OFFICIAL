// Feature services. Each function returns a clean domain model and, depending on
// DATA_MODE, either calls the live backend or serves bundled demo data.
// In "auto" mode it tries live first and falls back to demo when unreachable.
import client, { isUnreachable } from "./client";
import { mock } from "./mockData";
import { ALWAYS_MOCK, NEVER_FALLBACK } from "../config";

// Tracks whether we are currently serving demo data, for a UI banner.
let servingDemo = ALWAYS_MOCK;
export const isDemoActive = () => servingDemo;

// Wrap a live call with demo fallback according to the configured mode.
async function withFallback(liveFn, mockFn) {
  if (ALWAYS_MOCK) {
    servingDemo = true;
    return mockFn();
  }
  try {
    const result = await liveFn();
    servingDemo = false;
    return result;
  } catch (error) {
    if (!NEVER_FALLBACK && isUnreachable(error)) {
      servingDemo = true;
      return mockFn();
    }
    throw error;
  }
}

// --- Mappers ----------------------------------------------------------------
const toAttendance = (x) => ({
  staffId: x.staff_ID,
  name: x.name || x.staff_ID,
  checkIn: x.entryTime || "—",
  checkOut: x.exitTime || "—",
  date: x.date,
  location: x.location || "Digital Innovation Lab",
  present: !x.exitTime || x.exitTime === "—",
});

const toUser = (x) => ({
  name: x.name,
  staffId: x.staff_ID,
  email: x.email,
  phone: x.phone_number,
  role: x.lab_role,
});

// --- Auth -------------------------------------------------------------------
export const authService = {
  login: ({ staffId, password }) =>
    withFallback(
      async () => {
        const { data } = await client.post("/api/User/loginAdmin", {
          Staff_ID: staffId,
          Password: password,
        });
        return { token: data.token, message: data.message };
      },
      () => mock.login({ staffId, password })
    ),
};

// --- Attendance -------------------------------------------------------------
export const attendanceService = {
  today: () =>
    withFallback(
      async () => {
        const date = new Date().toISOString().split("T")[0];
        const { data } = await client.post("/api/Attendance/AttendanceByDate", { date });
        return data.map(toAttendance);
      },
      () => mock.attendanceToday().map(toAttendance)
    ),
  history: () =>
    withFallback(
      async () => {
        const { data } = await client.get("/api/Attendance/AttendanceHistory");
        return data.map(toAttendance);
      },
      () => mock.attendanceHistory().map(toAttendance)
    ),
};

// --- Users ------------------------------------------------------------------
export const userService = {
  list: () =>
    withFallback(
      async () => {
        const { data } = await client.get("/api/User/AddedUsers");
        return data.map(toUser);
      },
      () => mock.users().map(toUser)
    ),
  confirmPassword: ({ staffId, password }) =>
    withFallback(
      async () => {
        const { data } = await client.post("/api/User/ConfirmPassword", {
          Staff_ID: staffId,
          Password: password,
        });
        return data;
      },
      () => ({ ok: true })
    ),
  add: (user) =>
    withFallback(
      async () => {
        const { data } = await client.post("/api/User/AddUser", {
          name: user.name,
          email: user.email,
          phone_number: user.phone,
          staff_ID: user.staffId,
          lab_role: user.role,
        });
        return data;
      },
      () => mock.addUser({ name: user.name, email: user.email, phone_number: user.phone, staff_ID: user.staffId, lab_role: user.role })
    ),
  approve: (staffId) =>
    withFallback(
      async () => (await client.post("/api/User/Approve", { Staff_ID: staffId })).data,
      () => mock.approve(staffId)
    ),
  deny: (staffId) =>
    withFallback(
      async () => (await client.post("/api/User/DenyUser", { Staff_ID: staffId })).data,
      () => mock.deny(staffId)
    ),
};

// --- Notifications & approvals ---------------------------------------------
export const notificationService = {
  list: (roleID) =>
    withFallback(
      async () => {
        const { data } = await client.get("/api/User/GetNotification");
        return data
          .filter((n) => n.roleID === roleID && !n.isRead)
          .map((n) => ({ id: n.id, staffId: n.staff_ID, message: n.message, name: n.name }));
      },
      () =>
        mock
          .notifications()
          .map((n) => ({ id: n.id, staffId: n.staff_ID, message: n.message, name: n.name }))
    ),
  approvalHistory: () =>
    withFallback(
      async () => {
        const { data } = await client.get("/api/User/ApprovalHistory");
        return data.map((a, i) => ({
          id: a.id ?? i,
          name: a.name,
          approved: a.approvalStatus,
          date: a.date,
        }));
      },
      () =>
        mock
          .approvalHistory()
          .map((a) => ({ id: a.id, name: a.name, approved: a.approvalStatus, date: a.date }))
    ),
  deleteApproval: (id) =>
    withFallback(
      async () => (await client.delete(`/api/User/DeletionHistory/${id}`)).data,
      () => mock.deleteApproval(id)
    ),
};
