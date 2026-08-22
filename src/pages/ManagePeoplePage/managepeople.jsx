import React, { useState, useEffect, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userService } from "../../api/services";
import { roleLabel } from "../../config";
import "./managepeople.css";

const initials = (s) =>
  (s || "?").split(/[\s._-]+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const isAdmin = (role) => role === "A1" || role === "B2";

function Managepeople() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("admins");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    userService
      .list()
      .then((data) => active && setUsers(data.filter((u) => u.name)))
      .catch(() => active && setUsers([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const base = activeTab === "admins" ? users.filter((u) => isAdmin(u.role)) : users;
    return base.filter((u) =>
      `${u.name} ${u.staffId} ${u.email}`.toLowerCase().includes(q)
    );
  }, [users, activeTab, searchTerm]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Manage people</h1>
          <p className="page-sub">
            {users.length} {users.length === 1 ? "person" : "people"} in the system
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/add-new-user")}>
          + Add new user
        </button>
      </div>

      <div className="mp-controls">
        <div className="tabs">
          <button
            className={activeTab === "admins" ? "tab is-active" : "tab"}
            onClick={() => setActiveTab("admins")}
          >
            Admins
          </button>
          <button
            className={activeTab === "allUsers" ? "tab is-active" : "tab"}
            onClick={() => setActiveTab("allUsers")}
          >
            All users
          </button>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search people"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CiSearch />
        </div>
      </div>

      <div className="card mp-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff ID</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={`${u.staffId}-${i}`}>
                <td>
                  <div className="person">
                    <span className="avatar">{initials(u.name)}</span>
                    <span className="cell-name">{u.name}</span>
                  </div>
                </td>
                <td className="mono">{u.staffId}</td>
                <td>{u.email}</td>
                <td>
                  <span className={isAdmin(u.role) ? "pill pill--admin pill--no" : "pill pill--staff pill--no"}>
                    {roleLabel(u.role)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && rows.length === 0 && (
          <div className="empty">
            <span className="empty__mark">
              <FiUsers />
            </span>
            <h3>No people found</h3>
            <p>Try a different search, or add a new user to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Managepeople;
