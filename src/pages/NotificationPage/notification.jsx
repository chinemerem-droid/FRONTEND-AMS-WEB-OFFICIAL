import React, { useState, useEffect, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { FiEye, FiEyeOff, FiInbox, FiLock } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { notificationService, userService } from "../../api/services";
import "./notification.css";

const Notification = () => {
  const { roleID, nameID } = useAuth();
  const canDecide = roleID === "A1"; // only super admins approve/deny

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(null); // notification awaiting approval
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await notificationService.list(roleID);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [roleID]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((n) =>
    `${n.name || ""} ${n.staffId || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmApproval = async () => {
    if (!password) {
      toast.error("Enter your password to confirm.");
      return;
    }
    setSubmitting(true);
    try {
      await userService.confirmPassword({ staffId: nameID, password });
      await userService.approve(pending.staffId);
      toast.success(`Approved ${pending.name || pending.staffId}`);
      setPending(null);
      setPassword("");
      load();
    } catch (error) {
      const status = error?.response?.status;
      toast.error(status === 401 ? "Incorrect password. Please try again." : "Approval failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const denyUser = async (notification) => {
    try {
      await userService.deny(notification.staffId);
      toast.success(`Declined ${notification.name || notification.staffId}`);
      load();
    } catch {
      toast.error("Could not decline the request.");
    }
  };

  return (
    <div className="page">
      <ToastContainer position="top-center" />
      <div className="page-head">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">Onboarding requests awaiting your review</p>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search requests"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CiSearch />
        </div>
      </div>

      <div className="notif-list">
        {filtered.map((n) => (
          <div className="card notif-item" key={n.id}>
            <div className="notif-item__body">
              <span className="notif-item__dot" />
              <div>
                <p className="notif-item__msg">{n.message}</p>
                <span className="notif-item__meta mono">{n.staffId} · Today</span>
              </div>
            </div>
            {canDecide && (
              <div className="notif-item__actions">
                <button className="btn btn--success" onClick={() => setPending(n)}>
                  Approve
                </button>
                <button className="btn btn--danger" onClick={() => denyUser(n)}>
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="card">
            <div className="empty">
              <span className="empty__mark">
                <FiInbox />
              </span>
              <h3>You're all caught up</h3>
              <p>There are no onboarding requests to review right now.</p>
            </div>
          </div>
        )}
      </div>

      {pending && (
        <div className="modal-overlay" onClick={() => !submitting && setPending(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <div>
                <h2>Password required</h2>
                <p>Confirm your administrator password to approve {pending.name || pending.staffId}.</p>
              </div>
              <button className="modal__close" onClick={() => setPending(null)} aria-label="Close">
                ×
              </button>
            </div>

            <div className="field">
              <FiLock className="field__icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Administrator password"
                value={password}
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmApproval()}
              />
              {showPassword ? (
                <FiEye className="field__toggle" onClick={() => setShowPassword(false)} />
              ) : (
                <FiEyeOff className="field__toggle" onClick={() => setShowPassword(true)} />
              )}
            </div>

            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setPending(null)} disabled={submitting}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={confirmApproval} disabled={submitting}>
                {submitting ? "Approving…" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
