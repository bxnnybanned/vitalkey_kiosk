import { useMemo, useState } from "react";

const dashboardStats = [
  { label: "Patients Today", value: 12, trend: "+8%", trendType: "up", accent: "blue", icon: "users" },
  { label: "Scheduled", value: 8, trend: "+5%", trendType: "up", accent: "teal", icon: "calendar" },
  { label: "Completed", value: 3, trend: "0%", trendType: "up", accent: "orange", icon: "check" },
  {
    label: "Pending Prescriptions",
    value: 5,
    trend: "-2%",
    trendType: "down",
    accent: "violet",
    icon: "file",
  },
];

const queueRows = [
  { id: "P-001", initials: "MS", name: "Maria Santos", time: "08:00", queue: 1, status: "In Progress" },
  { id: "P-002", initials: "JD", name: "Juan dela Cruz", time: "08:30", queue: 2, status: "Waiting" },
  { id: "P-003", initials: "AR", name: "Ana Reyes", time: "09:00", queue: 3, status: "Waiting" },
  { id: "P-004", initials: "CB", name: "Carlos Bautista", time: "09:30", queue: 4, status: "Completed" },
  { id: "P-005", initials: "LM", name: "Liza Manalo", time: "10:00", queue: 5, status: "Waiting" },
];

const initialPrescriptions = [
  { id: "RX-001", patient: "Maria Santos", medicine: "Amoxicillin 500mg", date: "Mar 9", status: "Dispensed" },
  { id: "RX-002", patient: "Juan dela Cruz", medicine: "Paracetamol 500mg", date: "Mar 9", status: "Pending" },
  { id: "RX-003", patient: "Ana Reyes", medicine: "Ibuprofen 400mg", date: "Mar 8", status: "Dispensed" },
];

const vitalCards = [
  { label: "Blood Pressure", value: "130/85", icon: "pulse", accent: "rose" },
  { label: "Heart Rate", value: "80 bpm", icon: "heart", accent: "pink" },
  { label: "Temperature", value: "37.1C", icon: "temp", accent: "amber" },
  { label: "Height", value: "170 cm", icon: "person", accent: "blue" },
  { label: "Weight", value: "72 kg", icon: "person", accent: "teal" },
  { label: "BMI", value: "24.9", icon: "wave", accent: "violet" },
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4a5 5 0 00-5 5v2.7c0 .8-.2 1.6-.6 2.3L5 16h14l-1.4-2c-.4-.7-.6-1.5-.6-2.3V9a5 5 0 00-5-5z" />
      <path d="M10 18a2 2 0 004 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 6H6a2 2 0 00-2 2v8a2 2 0 002 2h4" />
      <path d="M13 16l5-4-5-4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function iconByName(name) {
  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.2" />
        <rect x="14" y="14" width="6" height="6" rx="1.2" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.8-2.6 2.9-4 5.5-4s4.7 1.4 5.5 4" />
        <circle cx="17" cy="9" r="2.5" />
      </svg>
    );
  }
  if (name === "file") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5" />
      </svg>
    );
  }
  if (name === "calendar") {
    return <CalendarIcon />;
  }
  if (name === "check") {
    return <CheckIcon />;
  }
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.8-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.2-7 10-7 10z" />
      </svg>
    );
  }
  if (name === "temp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5a2 2 0 114 0v8.3a4 4 0 11-4 0z" />
      </svg>
    );
  }
  if (name === "person") {
    return <UserIcon />;
  }
  if (name === "wave") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12h4l2-5 3 10 2-6h7" />
      </svg>
    );
  }

  return <PulseIcon />;
}

function DoctorLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (username.trim().toLowerCase() === "doctor" && password === "vitalkey2026") {
      setError("");
      onSuccess();
      return;
    }

    setError("Invalid credentials. Use doctor / vitalkey2026.");
  }

  return (
    <main className="doctor-auth-page">
      <section className="brand-panel">
        <div className="brand-top">
          <div className="brand-icon">
            <PulseIcon />
          </div>
          <div>
            <h1>VitalKey</h1>
            <p>Doctor Portal</p>
          </div>
        </div>

        <div className="brand-copy">
          <h2>Doctor care and patient flow made reliable.</h2>
          <p>
            Access patient records, manage consultations, and monitor the daily
            queue in one secure system.
          </p>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-card">
          <h3>Welcome back</h3>
          <p>Sign in to your VitalKey doctor account.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="signin-btn">Sign In</button>
          </form>

          <div className="demo-creds">
            <code>doctor / vitalkey2026</code>
          </div>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <PulseIcon />
        </div>
        <div>
          <h2>VitalKey</h2>
          <p>Doctor</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Overview</h3>
        <button
          className={`menu-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          {iconByName("grid")}
          Dashboard
        </button>
      </div>

      <div className="sidebar-section">
        <h3>Patients</h3>
        <button
          className={`menu-item ${activePage === "queue" ? "active" : ""}`}
          onClick={() => onNavigate("queue")}
        >
          {iconByName("users")}
          Queue
        </button>
        <button
          className={`menu-item ${activePage === "patient-detail" ? "active" : ""}`}
          onClick={() => onNavigate("patient-detail")}
        >
          {iconByName("person")}
          Patient Detail
        </button>
      </div>

      <div className="sidebar-section">
        <h3>Clinical</h3>
        <button
          className={`menu-item ${activePage === "prescriptions" ? "active" : ""}`}
          onClick={() => onNavigate("prescriptions")}
        >
          {iconByName("file")}
          Prescriptions
        </button>
        <button
          className={`menu-item ${activePage === "consultation" ? "active" : ""}`}
          onClick={() => onNavigate("consultation")}
        >
          {iconByName("wave")}
          Consultation
        </button>
      </div>

      <button type="button" className="sidebar-user" onClick={onLogout} aria-label="Log out">
        <div className="avatar">DR</div>
        <div className="sidebar-user-meta">
          <strong>Dr. Rivera</strong>
          <p>General Physician · Logout</p>
        </div>
        <span className="sidebar-logout-icon">
          <LogoutIcon />
        </span>
      </button>
    </aside>
  );
}

function Topbar({ title }) {
  const topDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <header className="dashboard-topbar">
      <h1>{title}</h1>
      <div className="topbar-right">
        <div className="date-chip">{topDate}</div>
        <button className="bell-btn" aria-label="Notifications">
          <BellIcon />
          <span className="dot" />
        </button>
        <div className="top-avatar">DR</div>
      </div>
    </header>
  );
}

function DashboardHome({ onViewPatient }) {
  return (
    <div className="dashboard-content">
      <section className="hero-headline">
        <h2>Good morning, Dr. Rivera</h2>
        <p>Monday, March 9, 2026</p>
      </section>

      <section className="stats-grid">
        {dashboardStats.map((item) => (
          <article key={item.label} className={`stat-card ${item.accent}`}>
            <div className="stat-top">
              <span className="stat-icon">{iconByName(item.icon)}</span>
              <span className={`trend ${item.trendType}`}>{item.trend}</span>
            </div>
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="queue-card">
        <div className="queue-head">
          <div>
            <h3>Today&apos;s Patient Queue</h3>
            <p>12 patients scheduled</p>
          </div>
          <button className="view-all">View all</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Time</th>
                <th>Queue</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {queueRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    <div className="patient-cell">
                      <span className="patient-avatar">{row.initials}</span>
                      {row.name}
                    </div>
                  </td>
                  <td>{row.time}</td>
                  <td>
                    <span className="queue-num">{row.queue}</span>
                  </td>
                  <td>
                    <span className={`status ${row.status.toLowerCase().replace(" ", "-")}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn" onClick={onViewPatient}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PatientDetailPage({
  onBack,
  onSaveNotes,
  onPrescribe,
  noteText,
  onNoteTextChange,
  noteSaved,
}) {
  const [medicineInput, setMedicineInput] = useState("");

  function handleAddPrescription() {
    const medicine = medicineInput.trim() || "Paracetamol 500mg";
    onPrescribe("Juan dela Cruz", medicine);
    setMedicineInput("");
  }

  return (
    <div className="dashboard-content patient-detail-page">
      <div className="detail-top">
        <button className="back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Patient Detail</h2>
      </div>

      <section className="detail-grid">
        <article className="patient-info-card">
          <h3>PATIENT INFORMATION</h3>

          <div className="patient-header">
            <span className="patient-id-avatar">JD</span>
            <div>
              <h4>Juan dela Cruz</h4>
              <p>P-002 . Male</p>
            </div>
          </div>

          <div className="patient-fields">
            <div>
              <span>Age</span>
              <strong>32 years</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>Male</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>45 Mabini Ave</strong>
            </div>
          </div>
        </article>

        <div className="vitals-grid">
          {vitalCards.map((item) => (
            <article key={item.label} className="vital-card">
              <span className={`vital-icon ${item.accent}`}>{iconByName(item.icon)}</span>
              <h4>{item.value}</h4>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consultation-card">
        <h3>CONSULTATION NOTES</h3>
        <textarea
          placeholder="Observations, diagnosis, treatment plan..."
          rows={5}
          value={noteText}
          onChange={(event) => onNoteTextChange(event.target.value)}
        />
        <div className="notes-action-row">
          <button className="save-notes-btn" onClick={onSaveNotes}>
            Save Notes
          </button>
          {noteSaved ? <span className="saved-hint">Notes saved.</span> : null}
        </div>
      </section>

      <section className="prescription-card">
        <div className="prescription-head">
          <h3>PRESCRIPTION</h3>
          <div className="prescribe-inline">
            <input
              type="text"
              placeholder="Medicine name"
              value={medicineInput}
              onChange={(event) => setMedicineInput(event.target.value)}
            />
            <button className="prescribe-btn" onClick={handleAddPrescription}>
              + Prescribe Medicine
            </button>
          </div>
        </div>
        <p>Add medicine then click prescribe. It will appear in Prescriptions page.</p>
      </section>
    </div>
  );
}

function PrescriptionsPage({ prescriptions, onToggleStatus, onAddPrescription }) {
  const [patient, setPatient] = useState("Juan dela Cruz");
  const [medicine, setMedicine] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!medicine.trim()) {
      return;
    }

    onAddPrescription(patient, medicine.trim());
    setMedicine("");
  }

  return (
    <div className="dashboard-content page-block">
      <section className="hero-headline">
        <h2>Prescriptions</h2>
        <p>All issued prescriptions</p>
      </section>

      <section className="queue-card">
        <form className="quick-form" onSubmit={handleSubmit}>
          <select value={patient} onChange={(event) => setPatient(event.target.value)}>
            {queueRows.map((row) => (
              <option key={row.id} value={row.name}>
                {row.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Medicine (e.g. Co-Amoxiclav 625mg)"
            value={medicine}
            onChange={(event) => setMedicine(event.target.value)}
          />
          <button type="submit" className="view-btn">
            Add Prescription
          </button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>RX ID</th>
                <th>Patient</th>
                <th>Medicine</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.patient}</td>
                  <td>{item.medicine}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => onToggleStatus(item.id)}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ConsultationPage({
  selectedPatientId,
  onSelectPatient,
  consultationNote,
  onConsultationNoteChange,
  onStart,
  onComplete,
  message,
  stats,
}) {
  return (
    <div className="dashboard-content page-block">
      <section className="hero-headline">
        <h2>Consultation</h2>
      </section>

      <section className="stats-grid">
        <article className="stat-card blue">
          <div className="stat-top">
            <span className="stat-icon">{iconByName("users")}</span>
          </div>
          <h3>{stats.total}</h3>
          <p>Today&apos;s Total</p>
        </article>
        <article className="stat-card teal">
          <div className="stat-top">
            <span className="stat-icon">{iconByName("check")}</span>
          </div>
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </article>
        <article className="stat-card orange">
          <div className="stat-top">
            <span className="stat-icon">{iconByName("pulse")}</span>
          </div>
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </article>
        <article className="stat-card violet">
          <div className="stat-top">
            <span className="stat-icon">{iconByName("calendar")}</span>
          </div>
          <h3>{stats.remaining}</h3>
          <p>Remaining</p>
        </article>
      </section>

      <section className="queue-card consultation-workspace">
        <div className="quick-form">
          <select value={selectedPatientId} onChange={(event) => onSelectPatient(event.target.value)}>
            <option value="">Select patient from queue</option>
            {queueRows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id} - {row.name}
              </option>
            ))}
          </select>
          <button className="view-btn" onClick={onStart}>
            Start Consultation
          </button>
          <button className="save-notes-btn" onClick={onComplete}>
            Complete Consultation
          </button>
        </div>

        <textarea
          placeholder="Consultation notes..."
          value={consultationNote}
          onChange={(event) => onConsultationNoteChange(event.target.value)}
          rows={5}
        />

        <p className="consult-msg">{message || "Select a patient from the queue to begin consultation."}</p>
      </section>
    </div>
  );
}

function DoctorApp({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [detailNotes, setDetailNotes] = useState("");
  const [detailSaved, setDetailSaved] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [consultationNote, setConsultationNote] = useState("");
  const [consultMsg, setConsultMsg] = useState("");
  const [consultState, setConsultState] = useState({
    total: 12,
    completed: 3,
    inProgress: 1,
    remaining: 8,
  });

  const pageTitleMap = {
    dashboard: "Dashboard",
    queue: "Queue",
    "patient-detail": "Patient Detail",
    prescriptions: "Prescriptions",
    consultation: "Consultation",
  };

  function addPrescription(patient, medicine) {
    const nextId = `RX-${String(prescriptions.length + 1).padStart(3, "0")}`;
    const today = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date());

    setPrescriptions((prev) => [
      { id: nextId, patient, medicine, date: today, status: "Pending" },
      ...prev,
    ]);
  }

  function togglePrescriptionStatus(id) {
    setPrescriptions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Pending" ? "Dispensed" : "Pending" }
          : item
      )
    );
  }

  function handleSaveNotes() {
    if (!detailNotes.trim()) {
      setDetailSaved(false);
      return;
    }

    setDetailSaved(true);
  }

  function startConsultation() {
    if (!selectedPatientId) {
      setConsultMsg("Please choose a patient first.");
      return;
    }

    setConsultMsg(`Consultation started for ${selectedPatientId}.`);
  }

  function completeConsultation() {
    if (!selectedPatientId) {
      setConsultMsg("Please choose a patient first.");
      return;
    }

    setConsultState((prev) => {
      const nextCompleted = prev.completed + 1;
      const nextInProgress = Math.max(0, prev.inProgress - 1);
      const nextRemaining = Math.max(0, prev.total - nextCompleted - nextInProgress);

      return {
        ...prev,
        completed: nextCompleted,
        inProgress: nextInProgress,
        remaining: nextRemaining,
      };
    });

    setConsultMsg(`Consultation for ${selectedPatientId} marked completed.`);
    setSelectedPatientId("");
    setConsultationNote("");
  }

  return (
    <main className="doctor-dashboard">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={onLogout} />

      <section className="dashboard-main">
        <Topbar title={pageTitleMap[activePage]} />

        {activePage === "patient-detail" ? (
          <PatientDetailPage
            onBack={() => setActivePage("dashboard")}
            onSaveNotes={handleSaveNotes}
            onPrescribe={(patient, medicine) => {
              addPrescription(patient, medicine);
              setActivePage("prescriptions");
            }}
            noteText={detailNotes}
            onNoteTextChange={(value) => {
              setDetailSaved(false);
              setDetailNotes(value);
            }}
            noteSaved={detailSaved}
          />
        ) : null}

        {activePage === "prescriptions" ? (
          <PrescriptionsPage
            prescriptions={prescriptions}
            onToggleStatus={togglePrescriptionStatus}
            onAddPrescription={addPrescription}
          />
        ) : null}

        {activePage === "consultation" ? (
          <ConsultationPage
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            consultationNote={consultationNote}
            onConsultationNoteChange={setConsultationNote}
            onStart={startConsultation}
            onComplete={completeConsultation}
            message={consultMsg}
            stats={consultState}
          />
        ) : null}

        {activePage === "dashboard" || activePage === "queue" ? (
          <DashboardHome onViewPatient={() => setActivePage("patient-detail")} />
        ) : null}
      </section>
    </main>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <DoctorLogin onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <DoctorApp onLogout={() => setIsLoggedIn(false)} />;
}
