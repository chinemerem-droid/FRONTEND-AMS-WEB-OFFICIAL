import React, { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { CiSearch } from "react-icons/ci";
import { FiTrash2, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { attendanceService, notificationService } from "../../api/services";
import "./history.css";

const RANGES = {
  All: null,
  "Last 5 days": 5,
  "Last week": 7,
  "Last month": 30,
};

const History = () => {
  const [tab, setTab] = useState("attendance");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("All");
  const [attendance, setAttendance] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([attendanceService.history(), notificationService.approvalHistory()])
      .then(([att, appr]) => {
        if (!active) return;
        setAttendance(att);
        setApprovals(appr);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const withinRange = useCallback(
    (dateStr) => {
      const days = RANGES[range];
      if (!days) return true;
      const cutoff = dayjs().subtract(days, "day");
      return dayjs(dateStr).isAfter(cutoff);
    },
    [range]
  );

  const attendanceRows = useMemo(
    () =>
      attendance
        .filter((r) => withinRange(r.date))
        .filter((r) =>
          `${r.name} ${r.staffId} ${dayjs(r.date).format("MMM D")}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
    [attendance, search, withinRange]
  );

  const approvalRows = useMemo(
    () =>
      approvals
        .filter((a) => withinRange(a.date))
        .filter((a) => (a.name || "").toLowerCase().includes(search.toLowerCase())),
    [approvals, search, withinRange]
  );

  const deleteApproval = async (id) => {
    const prev = approvals;
    setApprovals((list) => list.filter((a) => a.id !== id)); // optimistic
    try {
      await notificationService.deleteApproval(id);
    } catch {
      setApprovals(prev); // roll back on failure
    }
  };

  const showAttendance = tab === "attendance";

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">History</h1>
      </div>

      <div className="hist-controls">
        <div className="tabs">
          <button
            className={showAttendance ? "tab is-active" : "tab"}
            onClick={() => setTab("attendance")}
          >
            Attendance
          </button>
          <button
            className={!showAttendance ? "tab is-active" : "tab"}
            onClick={() => setTab("approval")}
          >
            Approvals
          </button>
        </div>

        <div className="hist-filters">
          <div className="search">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch />
          </div>
          <select
            className="hist-range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {Object.keys(RANGES).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card hist-card">
        {showAttendance ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Staff ID</th>
                  <th>Check in</th>
                  <th>Check out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((r, i) => (
                  <tr key={`${r.staffId}-${r.date}-${i}`}>
                    <td>{dayjs(r.date).format("MMM D, YYYY")}</td>
                    <td className="mono">{r.staffId}</td>
                    <td className="mono">{r.checkIn}</td>
                    <td className="mono">{r.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && attendanceRows.length === 0 && (
              <div className="empty">
                <span className="empty__mark">
                  <FiCalendar />
                </span>
                <h3>No attendance records</h3>
                <p>Nothing matches this range or search.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="approval-list">
              {approvalRows.map((a) => (
                <div className="approval-row" key={a.id}>
                  <span className={a.approved ? "approval-icon approval-icon--yes" : "approval-icon approval-icon--no"}>
                    {a.approved ? <FiCheckCircle /> : <FiXCircle />}
                  </span>
                  <div className="approval-text">
                    <p>
                      You {a.approved ? "approved" : "declined"} the onboarding request for{" "}
                      <strong>{a.name}</strong>
                    </p>
                    <span className="approval-date mono">{dayjs(a.date).format("MMM D, YYYY")}</span>
                  </div>
                  <button
                    className="approval-delete"
                    onClick={() => deleteApproval(a.id)}
                    aria-label="Delete record"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
            {!loading && approvalRows.length === 0 && (
              <div className="empty">
                <span className="empty__mark">
                  <FiCalendar />
                </span>
                <h3>No approval history</h3>
                <p>Approval and decline decisions will appear here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
