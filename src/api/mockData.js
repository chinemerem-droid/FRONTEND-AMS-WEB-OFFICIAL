// Bundled demo data + a local, in-memory "backend" used when the live API is
// unreachable. Everything here is deterministic so the demo looks consistent.
import { DEMO_CREDENTIALS } from "../config";

const LOCATION = "Digital Innovation Lab";

// Builds a decodable (unsigned) JWT so pages that decode the token still work.
export const mintDemoToken = ({ staffId, role }) => {
  const b64url = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    LabRole: role,
    nameid: staffId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };
  return `${b64url(header)}.${b64url(payload)}.`;
};

// --- People -----------------------------------------------------------------
let users = [
  { name: "Amara Okafor", staff_ID: "Staff001", email: "amara.okafor@lab.io", phone_number: "0801 234 5678", lab_role: "A1" },
  { name: "Daniel Mensah", staff_ID: "Staff014", email: "daniel.mensah@lab.io", phone_number: "0802 987 1122", lab_role: "B2" },
  { name: "Priya Nair", staff_ID: "Staff027", email: "priya.nair@lab.io", phone_number: "0803 445 8890", lab_role: "B2" },
  { name: "Jonas Weber", staff_ID: "Staff033", email: "jonas.weber@lab.io", phone_number: "0805 220 7788", lab_role: "C3" },
  { name: "Lucia Rossi", staff_ID: "Staff041", email: "lucia.rossi@lab.io", phone_number: "0806 771 3344", lab_role: "C3" },
  { name: "Kwame Boateng", staff_ID: "Staff052", email: "kwame.boateng@lab.io", phone_number: "0807 664 9900", lab_role: "C3" },
  { name: "Sara Haddad", staff_ID: "Staff058", email: "sara.haddad@lab.io", phone_number: "0808 553 2211", lab_role: "C3" },
  { name: "Marcus Lee", staff_ID: "Staff063", email: "marcus.lee@lab.io", phone_number: "0809 112 6677", lab_role: "C3" },
];

const today = () => new Date().toISOString().split("T")[0];

// --- Attendance (today) -----------------------------------------------------
const attendanceToday = [
  { staff_ID: "Staff001", entryTime: "08:12", exitTime: "—", date: today(), location: LOCATION },
  { staff_ID: "Staff014", entryTime: "08:47", exitTime: "—", date: today(), location: LOCATION },
  { staff_ID: "Staff033", entryTime: "09:03", exitTime: "—", date: today(), location: LOCATION },
  { staff_ID: "Staff041", entryTime: "09:21", exitTime: "13:30", date: today(), location: LOCATION },
  { staff_ID: "Staff052", entryTime: "09:35", exitTime: "—", date: today(), location: LOCATION },
];

// --- Attendance history -----------------------------------------------------
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

const attendanceHistory = [
  { staff_ID: "Staff001", entryTime: "08:05", exitTime: "17:22", date: daysAgo(1) },
  { staff_ID: "Staff014", entryTime: "08:33", exitTime: "17:41", date: daysAgo(1) },
  { staff_ID: "Staff027", entryTime: "08:58", exitTime: "16:55", date: daysAgo(1) },
  { staff_ID: "Staff033", entryTime: "09:10", exitTime: "17:30", date: daysAgo(2) },
  { staff_ID: "Staff041", entryTime: "08:44", exitTime: "17:05", date: daysAgo(3) },
  { staff_ID: "Staff052", entryTime: "09:02", exitTime: "17:18", date: daysAgo(6) },
  { staff_ID: "Staff058", entryTime: "08:21", exitTime: "17:12", date: daysAgo(9) },
  { staff_ID: "Staff063", entryTime: "08:39", exitTime: "17:44", date: daysAgo(20) },
];

// --- Onboarding notifications (pending approvals) ---------------------------
let notifications = [
  { id: "n1", staff_ID: "Staff071", roleID: "A1", isRead: false, message: "Ngozi Eze requested onboarding as Staff", name: "Ngozi Eze" },
  { id: "n2", staff_ID: "Staff072", roleID: "A1", isRead: false, message: "Tom Fisher requested onboarding as Sub Administrator", name: "Tom Fisher" },
];

// --- Approval history -------------------------------------------------------
let approvalHistory = [
  { id: "a1", name: "Lucia Rossi", approvalStatus: true, date: daysAgo(4) },
  { id: "a2", name: "Ravi Kapoor", approvalStatus: false, date: daysAgo(7) },
  { id: "a3", name: "Kwame Boateng", approvalStatus: true, date: daysAgo(12) },
];

// --- Simulated endpoints ----------------------------------------------------
export const mock = {
  login: ({ staffId, password }) => {
    const user = users.find((u) => u.staff_ID === staffId);
    const isDemo =
      staffId === DEMO_CREDENTIALS.staffId &&
      password === DEMO_CREDENTIALS.password;
    // Demo mode accepts the documented demo credentials, or any known admin
    // with the demo password (so the whole roster is explorable offline).
    if (isDemo || (user && ["A1", "B2"].includes(user.lab_role) && password === DEMO_CREDENTIALS.password)) {
      const role = user ? user.lab_role : "A1";
      return {
        token: mintDemoToken({ staffId, role }),
        roleID: role,
        nameID: staffId,
        message: "Signed in (demo mode)",
      };
    }
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  },
  attendanceToday: () => [...attendanceToday],
  attendanceHistory: () => [...attendanceHistory],
  users: () => [...users],
  notifications: () => notifications.filter((n) => !n.isRead),
  approvalHistory: () => [...approvalHistory],
  addUser: (u) => {
    users = [...users, { ...u, lab_role: u.lab_role || "C3" }];
    return { ok: true };
  },
  approve: (staffId) => {
    notifications = notifications.filter((n) => n.staff_ID !== staffId);
    return { ok: true };
  },
  deny: (staffId) => {
    notifications = notifications.filter((n) => n.staff_ID !== staffId);
    return { ok: true };
  },
  deleteApproval: (id) => {
    approvalHistory = approvalHistory.filter((a) => a.id !== id);
    return { ok: true };
  },
};
