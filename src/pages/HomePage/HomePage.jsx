import React, { useEffect, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { FiClock } from "react-icons/fi";
import { attendanceService } from "../../api/services";
import "./HomePage.css";

const initials = (s) =>
  (s || "?").split(/[\s._-]+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await attendanceService.today();
        if (active) setRecords(data);
      } catch {
        if (active) setRecords([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 10000); // live refresh
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(
    () =>
      records.filter((r) =>
        `${r.name} ${r.staffId}`.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  const presentCount = records.filter((r) => r.present).length;
  const checkedOut = records.length - presentCount;

  const stats = [
    { label: "On site now", value: presentCount, tone: "present" },
    { label: "Checked out", value: checkedOut, tone: "out" },
    { label: "Total today", value: records.length, tone: "brand" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Today's attendance</h1>
          <p className="page-sub">Live board — refreshes automatically every 10 seconds</p>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search name or Staff ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CiSearch />
        </div>
      </div>

      <div className="stat-row">
        {stats.map((s) => (
          <div key={s.label} className={`stat stat--${s.tone}`}>
            <span className="stat__value mono">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card home-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff ID</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={`${r.staffId}-${i}`}>
                <td>
                  <div className="person">
                    <span className="avatar">{initials(r.name)}</span>
                    <span className="cell-name">{r.name}</span>
                  </div>
                </td>
                <td className="mono">{r.staffId}</td>
                <td className="mono">{r.checkIn}</td>
                <td className="mono">{r.checkOut}</td>
                <td>{r.location}</td>
                <td>
                  <span className={r.present ? "pill pill--present" : "pill pill--out"}>
                    {r.present ? "On site" : "Checked out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <span className="empty__mark">
              <FiClock />
            </span>
            <h3>No check-ins yet</h3>
            <p>No one has checked in today. The board updates as people arrive.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
