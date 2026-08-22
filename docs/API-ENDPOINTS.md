# AMS Admin Portal — API Endpoints

Analysis of every backend endpoint the frontend depends on, the contracts that
still need confirming, and the endpoints the system clearly **needs but does not
have yet**.

- **Base URL:** `https://attsystem-latest.onrender.com` (env: `REACT_APP_API_URL`)
- **Status at time of writing:** backend returns **HTTP 503** (unreachable). The app runs on bundled demo data until it's back.
- **Auth model:** JWT bearer token from `loginAdmin`, stored in `sessionStorage`, attached as `Authorization: Bearer <token>` on every request (see `src/api/client.js`).
- **JWT claims used by the app:** `LabRole` (`A1` super admin / `B2` sub admin / `C3` staff), `nameid` (staff ID), `exp` (expiry).

Legend: 🔴 required to confirm · 🟡 recommended · Auth = needs bearer token.

---

## 1. Known endpoints (the app calls these today)

### Auth

| Method | Path | Auth | Body | Returns | Used by |
|---|---|---|---|---|---|
| POST | `/api/User/loginAdmin` | no | `{ Staff_ID, Password }` | `{ token, message }` | Login |

`token` must be a JWT carrying `LabRole`, `nameid`, `exp`.

### Attendance

| Method | Path | Auth | Body / Query | Returns | Used by |
|---|---|---|---|---|---|
| POST | `/api/Attendance/AttendanceByDate` | yes | `{ date: "YYYY-MM-DD" }` | `[{ staff_ID, entryTime, exitTime, date, location? }]` | Home (polls every 10s) |
| GET | `/api/Attendance/AttendanceHistory` | yes | — | `[{ staff_ID, entryTime, exitTime, date }]` | History |

### Users

| Method | Path | Auth | Body | Returns | Used by |
|---|---|---|---|---|---|
| GET | `/api/User/AddedUsers` | yes | — | `[{ name, staff_ID, email, phone_number, lab_role }]` | Manage People |
| POST | `/api/User/ConfirmPassword` | yes | `{ Staff_ID, Password }` | `200` on success, `401` on wrong password | Add User, Approve flow |
| POST | `/api/User/AddUser` | yes | `{ name, email, phone_number, staff_ID, lab_role }` | `200` / text | Add User |
| POST | `/api/User/Approve` | yes | `{ Staff_ID }` | `200` | Add User (A1), Notifications |
| POST | `/api/User/DenyUser` | yes | `{ Staff_ID }` | `200` | Notifications |

> ⚠️ **Casing bug found:** the original code called `ConfirmPassword` in one place and `Confirmpassword` (lowercase p) in another. The frontend is now standardized on **`ConfirmPassword`** — confirm the backend's real route name and that it's the only one.

### Notifications & approvals

| Method | Path | Auth | Body | Returns | Used by |
|---|---|---|---|---|---|
| GET | `/api/User/GetNotification` | yes | — | `[{ id, staff_ID, roleID, isRead, message, name }]` | Notifications |
| GET | `/api/User/ApprovalHistory` | yes | — | `[{ id?, name, approvalStatus: bool, date }]` | History |
| DELETE | `/api/User/DeletionHistory/{id}` | yes | — | `200` | History (delete approval record) |

### Password reset (unauthenticated flow)

| Method | Path | Auth | Body | Returns | Used by |
|---|---|---|---|---|---|
| POST | `/api/PasswordReset/request-reset` | no | `{ email }` | `200` (sends token email) | Reset Password |
| POST | `/api/PasswordReset/reset` | no | `{ email, token, NewPassword }` | `{ success, message }` | New Password |

---

## 2. Known endpoints, unconfirmed contracts 🔴

These we call, but the exact request/response shape is uncertain and should be pinned down:

1. **Time & date formats** — `entryTime` / `exitTime`: are they `"HH:mm"`, `"HH:mm:ss"`, ISO, or 12-hour? `date`: confirm `"YYYY-MM-DD"`. The UI renders these directly.
2. **`GetNotification` shape** — the original mapped mystery fields `sen1..sen4` that are never populated. Confirm the real notification object and drop the dead fields.
3. **`DeletionHistory/{id}` — what is `id`?** The original passed a client-side **array index**, not a record id. The backend needs to return and accept a **stable record id**.
4. **`ApprovalHistory` id** — same concern; each record needs a stable `id`.
5. **Error envelopes** — `loginAdmin` returns `error.response.data.message`; confirm a consistent error shape (`{ message }` / status codes) across all endpoints.
6. **Which endpoints require auth** — the app sends the bearer token on everything except login and password-reset. Confirm the backend's actual auth requirements per route.
7. **`AddUser` response** — currently parsed as text (`"User added successfully."`). Prefer JSON `{ success, message, staff_ID }`.

---

## 3. Missing endpoints the system needs 🟡

Derived from the feature set. None of these exist in the current frontend, but the product doesn't fully function without them.

### Attendance capture (the biggest gap)
The portal only ever **reads** attendance — nothing records it. There must be a capture path (kiosk / mobile / biometric device), and it needs endpoints:

| Method | Path (suggested) | Body | Why |
|---|---|---|---|
| POST | `/api/Attendance/CheckIn` | `{ staff_ID, location, timestamp }` | Record an arrival. Home shows a **Location** column, so check-in must capture it. |
| POST | `/api/Attendance/CheckOut` | `{ staff_ID, timestamp }` | Record a departure (sets `exitTime`). |

### Session & profile

| Method | Path (suggested) | Why |
|---|---|---|
| GET | `/api/User/me` | Fetch the logged-in admin's full profile. The topbar currently shows the **Staff ID**, not a real name, because there's no profile endpoint. |
| POST | `/api/User/logout` | Logout is client-only today (clears sessionStorage). No server-side token revocation. |
| POST | `/api/Auth/refresh` | JWT expires; there's no refresh, so sessions hard-die at expiry. |
| POST | `/api/User/ChangePassword` | Authenticated self-service password change (the old Layout had a change-password modal with no working endpoint). Distinct from the email reset flow. |

### User management (lifecycle beyond "add")

| Method | Path (suggested) | Why |
|---|---|---|
| GET | `/api/User/{staffId}` | User detail view. Manage People rows are clickable but there's no detail endpoint. |
| PUT/PATCH | `/api/User/{staffId}` | Edit a user (email, phone, **change role / promote / demote admin**). No edit path exists. |
| DELETE | `/api/User/{staffId}` | Offboard / deactivate an existing user. `DenyUser` only rejects a *pending* onboarding request — it can't remove an active one. |

### Notifications

| Method | Path (suggested) | Why |
|---|---|---|
| PUT | `/api/User/Notification/{id}/read` | Mark a notification read. The client filters on `isRead === false` but nothing ever sets it true (approve/deny removes it implicitly). |
| GET | `/api/User/Notification/count` | Unread badge for the sidebar/topbar. |

### Password reset

| Method | Path (suggested) | Why |
|---|---|---|
| POST | `/api/PasswordReset/verify-token` | Validate the token before showing the new-password screen. Today `token.jsx` just stores it and proceeds blindly. |

### Scale & operations

| Concern | Suggested change | Why |
|---|---|---|
| Pagination + search | `GET /api/User/AddedUsers?query=&page=&pageSize=` | Returns **all** users today; won't scale. Same for attendance history. |
| Server-side filtering | `GET /api/Attendance/History?from=&to=&staffId=&page=` | History filters entirely client-side after downloading everything. |
| Attendance summary | `GET /api/Attendance/Summary?date=` | Home computes present/checked-out/total in the browser; a summary endpoint is cheaper and authoritative. |
| Health check | `GET /api/health` | Lets the app detect availability directly instead of inferring it from 503s (relevant right now). |

---

## 4. Summary

- **13** endpoints are actively called and must exist for the current UI to work.
- **7** of those have contract details worth confirming (formats, ids, error shapes) — plus the **ConfirmPassword casing bug**.
- **~16** additional endpoints are needed to make the system complete: attendance **capture**, session/profile (`me`, logout, refresh, change-password), full **user lifecycle** (get/edit/delete), notification read-state, token verification, and pagination/summary/health for scale.

The single most important gap is **attendance capture** — without a check-in/check-out path, the portal has nothing real to display.
