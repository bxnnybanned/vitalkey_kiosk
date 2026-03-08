import { useState } from "react";

const features = [
  "Complete Patient Health Records",
  "Real-Time Appointment Scheduling",
  "Live Biometric Kiosk Integration",
  "Analytics & Reporting Dashboard",
];

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h4l2.2-6 3.2 12 2.2-7H21" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.8-3 4.3-4.5 7-4.5s5.2 1.5 7 4.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.7l4.3 4.3L19 7.3" />
    </svg>
  );
}

export default function AdminSignIn({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (username.trim() === "admin" && password === "vitalkey2025") {
      setError("");
      onLogin();
      return;
    }

    setError("Invalid credentials. Use admin / vitalkey2025.");
  }

  return (
    <main className="admin-auth-page">
      <section className="brand-panel">
        <div className="brand-glow brand-glow-top" />
        <div className="brand-glow brand-glow-bottom" />

        <div className="brand-top">
          <div className="brand-icon">
            <PulseIcon />
          </div>
          <h1>VitalKey</h1>
          <p>Health Center Management System</p>
        </div>

        <div className="brand-copy">
          <h2>
            Smart health center
            <br />
            management
            <br />
            <span>made simple.</span>
          </h2>
          <p>
            Manage doctors, patients, appointments, and medicines all in one
            secure, centralized platform.
          </p>
        </div>

        <ul className="feature-list">
          {features.map((text) => (
            <li key={text}>
              <span className="feature-icon">
                <CheckIcon />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-panel">
        <div className="form-card">
          <h3>Welcome back</h3>
          <p>Sign in to your VitalKey admin account to continue.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span className="input-icon">
                <UserIcon />
              </span>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">
                <LockIcon />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="form-meta">
              <label className="remember">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-btn">
                Forgot password?
              </button>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="signin-btn">
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>{" "}
              Sign In
            </button>
          </form>

          <div className="demo-creds">
            <p>Demo credentials</p>
            <code>admin / vitalkey2025</code>
          </div>
        </div>
      </section>
    </main>
  );
}

