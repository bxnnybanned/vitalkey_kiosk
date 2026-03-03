import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function useTimeLabel() {
  return useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const hr12 = h % 12 || 12;
    return `${hr12}:${m} ${ampm}`;
  }, []);
}

export default function PatientRegistration() {
  const navigate = useNavigate();
  const time = useTimeLabel();

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    address: "",
    contact: "",
  });

  const canSubmit =
    form.fullName.trim() &&
    String(form.age).trim() &&
    form.gender.trim() &&
    form.address.trim();

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    localStorage.setItem("vk_patient", JSON.stringify(form));
    navigate("/measure"); // next step (pwede mo palitan later)
  }

  return (
    <div className="pr-root">
      <div className="pr-frame">
        <div className="pr-card">
          {/* Top bar */}
          <header className="pr-topbar">
            <div className="pr-brand">
              <span className="pr-brand-dot" aria-hidden="true" />
              <span className="pr-brand-text">Patient Registration</span>
            </div>

            <div className="pr-topbar-right">
              <span className="pr-time">{time}</span>
              <span className="pr-status" aria-hidden="true">
                <span className="pr-status-dot" />
                <span className="pr-status-dot" />
                <span className="pr-status-dot" />
              </span>
            </div>
          </header>

          {/* Body */}
          <main className="pr-body">
            {/* Left */}
            <section className="pr-left">
              <div className="pr-icon" aria-hidden="true">
                🧾
              </div>

              <h1 className="pr-left-title">Fill Up Your Details</h1>
              <p className="pr-left-sub">
                Enter your basic information to get started.
              </p>

              <div className="pr-pill">
                <span className="pr-pill-dot" aria-hidden="true" />
                <span>Terms Accepted</span>
              </div>

              <p className="pr-note">Data privacy consent confirmed.</p>

              <button
                className="pr-submit"
                type="submit"
                form="pr-form"
                disabled={!canSubmit}
              >
                Submit &amp; Start <span aria-hidden="true">→</span>
              </button>
            </section>

            {/* Right */}
            <section className="pr-right">
              <form id="pr-form" className="pr-form" onSubmit={handleSubmit}>
                <div className="pr-field">
                  <label className="pr-label">FULL NAME</label>
                  <input
                    className="pr-input"
                    placeholder="e.g. Maria Santos"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                </div>

                <div className="pr-row">
                  <div className="pr-field">
                    <label className="pr-label">AGE</label>
                    <input
                      className="pr-input"
                      inputMode="numeric"
                      placeholder="34"
                      value={form.age}
                      onChange={(e) => updateField("age", e.target.value)}
                    />
                  </div>

                  <div className="pr-field">
                    <label className="pr-label">GENDER</label>
                    <select
                      className="pr-input pr-select"
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pr-field">
                  <label className="pr-label">ADDRESS / CITY</label>
                  <input
                    className="pr-input"
                    placeholder="e.g. Quezon City, Metro Manila"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>

                <div className="pr-field">
                  <label className="pr-label">CONTACT NUMBER (OPTIONAL)</label>
                  <input
                    className="pr-input"
                    placeholder="09XX XXX XXXX"
                    value={form.contact}
                    onChange={(e) => updateField("contact", e.target.value)}
                  />
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
