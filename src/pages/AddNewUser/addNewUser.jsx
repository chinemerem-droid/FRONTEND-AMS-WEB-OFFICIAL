import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiPhone, FiCreditCard, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../api/services";
import "./addNewUser.css";

const ROLE_OPTIONS = [
  { code: "C3", label: "Staff", hint: "Standard attendance access" },
  { code: "B2", label: "Sub Administrator", hint: "Can request new users" },
  { code: "A1", label: "Super Administrator", hint: "Full access & approvals" },
];

function AddNewUser() {
  const navigate = useNavigate();
  const { roleID, nameID } = useAuth();
  const isSuper = roleID === "A1";

  const [form, setForm] = useState({
    name: "",
    staffId: "",
    email: "",
    phone: "",
    role: "C3",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const heading = isSuper ? "Add new user" : "Request a new user";
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openConfirm = () => {
    if (!form.name || !form.staffId || !form.email) {
      toast.error("Name, Staff ID and email are required.");
      return;
    }
    setShowConfirm(true);
  };

  const submit = async () => {
    if (!password) {
      toast.error("Enter your password to confirm.");
      return;
    }
    setSubmitting(true);
    try {
      await userService.confirmPassword({ staffId: nameID, password });
      await userService.add(form);
      if (isSuper) {
        await userService.approve(form.staffId);
        toast.success(`${form.name} added successfully`);
      } else {
        toast.success("Request sent for approval");
      }
      setShowConfirm(false);
      setPassword("");
      setTimeout(() => navigate("/managepeople"), 900);
    } catch (error) {
      const status = error?.response?.status;
      toast.error(status === 401 ? "Incorrect password." : "Could not add the user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page anu">
      <ToastContainer transition={Slide} position="top-center" />
      <div className="page-head">
        <div>
          <h1 className="page-title">{heading}</h1>
          <p className="page-sub">Fill out the details below to onboard someone to the lab.</p>
        </div>
      </div>

      <div className="card anu-card">
        <div className="anu-grid">
          <div className="anu-field">
            <label>Full name</label>
            <div className="field">
              <FiUser className="field__icon" />
              <input type="text" placeholder="Jane Doe" value={form.name} onChange={update("name")} />
            </div>
          </div>

          <div className="anu-field">
            <label>Staff ID</label>
            <div className="field">
              <FiCreditCard className="field__icon" />
              <input type="text" placeholder="Staff099" value={form.staffId} onChange={update("staffId")} />
            </div>
          </div>

          <div className="anu-field">
            <label>Email</label>
            <div className="field">
              <FiMail className="field__icon" />
              <input type="email" placeholder="jane@lab.io" value={form.email} onChange={update("email")} />
            </div>
          </div>

          <div className="anu-field">
            <label>Phone number</label>
            <div className="field">
              <FiPhone className="field__icon" />
              <input type="tel" placeholder="0800 000 0000" value={form.phone} onChange={update("phone")} />
            </div>
          </div>
        </div>

        <div className="anu-field">
          <label>Role</label>
          <div className="anu-roles">
            {ROLE_OPTIONS.map((r) => (
              <button
                type="button"
                key={r.code}
                className={form.role === r.code ? "role-chip is-active" : "role-chip"}
                onClick={() => setForm((f) => ({ ...f, role: r.code }))}
              >
                <span className="role-chip__label">{r.label}</span>
                <span className="role-chip__hint">{r.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn--primary anu-submit" onClick={openConfirm}>
          {heading}
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => !submitting && setShowConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <div>
                <h2>Confirm your password</h2>
                <p>For security, confirm your administrator password to continue.</p>
              </div>
              <button className="modal__close" onClick={() => setShowConfirm(false)} aria-label="Close">
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
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              {showPassword ? (
                <FiEye className="field__toggle" onClick={() => setShowPassword(false)} />
              ) : (
                <FiEyeOff className="field__toggle" onClick={() => setShowPassword(true)} />
              )}
            </div>
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setShowConfirm(false)} disabled={submitting}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={submit} disabled={submitting}>
                {submitting ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNewUser;
