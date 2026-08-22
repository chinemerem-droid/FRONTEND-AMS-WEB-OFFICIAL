import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { MdOutlineHome, MdOutlineNotifications, MdOutlineHistory } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FiUserPlus, FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { isDemoActive } from "../api/services";
import { roleLabel } from "../config";
import "./Layout.css";

const navItems = [
  { path: "/home", name: "Home", icon: <MdOutlineHome /> },
  { path: "/notification", name: "Notifications", icon: <MdOutlineNotifications /> },
  { path: "/managepeople", name: "Manage People", icon: <IoSettingsOutline /> },
  { path: "/add-new-user", name: "Add New User", icon: <FiUserPlus /> },
  { path: "/history", name: "History", icon: <MdOutlineHistory /> },
];

const Layout = () => {
  const navigate = useNavigate();
  const { nameID, roleID, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const initials = (nameID || "?")
    .split(/[\s._-]+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={isOpen ? "shell" : "shell shell--collapsed"}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          {isOpen && (
            <div className="sidebar__brand-text">
              <span className="sidebar__mark">AMS</span>
              <span className="sidebar__sub">Admin Portal</span>
            </div>
          )}
          <button
            className="sidebar__toggle"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
              title={item.name}
            >
              <span className="nav-link__icon">{item.icon}</span>
              {isOpen && <span className="nav-link__text">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="nav-link nav-link--logout" onClick={handleLogout} title="Log out">
          <span className="nav-link__icon">
            <FiLogOut />
          </span>
          {isOpen && <span className="nav-link__text">Log out</span>}
        </button>
      </aside>

      <div className="shell__main">
        {isDemoActive() && (
          <div className="demo-banner">
            <strong>Demo mode</strong> — the live backend is unreachable, so you're viewing bundled sample data.
          </div>
        )}
        <header className="topbar">
          <div className="topbar__clock">
            <span className="topbar__date">{dateLabel}</span>
            <span className="topbar__time mono">{timeLabel}</span>
          </div>
          <div className="topbar__user">
            <div className="topbar__user-meta">
              <span className="topbar__name">{nameID || "Administrator"}</span>
              <span className="topbar__role">{roleLabel(roleID)}</span>
            </div>
            <span className="avatar">{initials}</span>
          </div>
        </header>

        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
