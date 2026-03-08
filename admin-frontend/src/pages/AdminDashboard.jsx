import { useMemo, useState } from "react";
import {
  DAY_PRESETS,
  buildWeeklySchedule,
  formatTime,
  getDailyOperatingHours,
  loadClinicConfig,
  saveClinicConfig,
  validateAppointmentSlot,
} from "../utils/clinicConfig";

const DOCTOR_STORAGE_KEY = "clinicDoctors";
const PATIENT_STORAGE_KEY = "clinicPatients";
const MEDICINE_STORAGE_KEY = "clinicMedicines";

const sideNav = {
  overview: ["Dashboard"],
  management: [
    "Health Center Settings",
    "Doctor Management",
    "Appointments",
    "Patient Records",
    "Medicine Catalog",
  ],
  analytics: ["Reports"],
};

const defaultDoctors = [
  {
    id: "doc-0001",
    code: "DOC-0001",
    name: "Dr. David Santos",
    specialization: "General Medicine",
    contactNumber: "+63 917 123 4567",
    schedule: "Mon-Fri · 8AM-5PM",
    status: "Active",
  },
  {
    id: "doc-0002",
    code: "DOC-0002",
    name: "Dr. Rosa Lim",
    specialization: "Cardiology",
    contactNumber: "+63 918 234 5678",
    schedule: "Mon-Thu · 8AM-3PM",
    status: "Active",
  },
  {
    id: "doc-0003",
    code: "DOC-0003",
    name: "Dr. Juan Reyes",
    specialization: "Pediatrics",
    contactNumber: "+63 919 345 6789",
    schedule: "Tue-Fri · 9AM-5PM",
    status: "Active",
  },
  {
    id: "doc-0004",
    code: "DOC-0004",
    name: "Dr. Ana Cruz",
    specialization: "Orthopedics",
    contactNumber: "+63 920 456 7890",
    schedule: "Mon-Wed · 8AM-5PM",
    status: "On Leave",
  },
  {
    id: "doc-0005",
    code: "DOC-0005",
    name: "Dr. Mark Villanueva",
    specialization: "Internal Medicine",
    contactNumber: "+63 921 567 8901",
    schedule: "Mon-Fri · 10AM-5PM",
    status: "Active",
  },
  {
    id: "doc-0006",
    code: "DOC-0006",
    name: "Dr. Lena Torres",
    specialization: "Dermatology",
    contactNumber: "+63 922 678 9012",
    schedule: "Wed-Fri · 9AM-4PM",
    status: "Active",
  },
];

const defaultPatients = [
  {
    id: "pat-001",
    patientId: "PAT-0012",
    fullName: "Maria Aquino",
    age: 34,
    gender: "Female",
    lastVisit: "2026-03-08",
    bloodPressure: "118/76",
    bmi: "22.4",
    temperature: "36.7",
    heartRate: "72",
    riskLevel: "Low Risk",
  },
  {
    id: "pat-002",
    patientId: "PAT-0028",
    fullName: "Jose Reyes",
    age: 58,
    gender: "Male",
    lastVisit: "2026-03-08",
    bloodPressure: "148/92",
    bmi: "28.1",
    temperature: "37.1",
    heartRate: "98",
    riskLevel: "High Risk",
  },
  {
    id: "pat-003",
    patientId: "PAT-0035",
    fullName: "Clara Lopez",
    age: 7,
    gender: "Female",
    lastVisit: "2026-03-08",
    bloodPressure: "100/65",
    bmi: "17.8",
    temperature: "37.8",
    heartRate: "88",
    riskLevel: "Moderate",
  },
  {
    id: "pat-004",
    patientId: "PAT-0041",
    fullName: "Miguel Bautista",
    age: 45,
    gender: "Male",
    lastVisit: "2026-03-07",
    bloodPressure: "132/85",
    bmi: "24.6",
    temperature: "36.9",
    heartRate: "78",
    riskLevel: "Moderate",
  },
  {
    id: "pat-005",
    patientId: "PAT-0052",
    fullName: "Sofia Ramos",
    age: 29,
    gender: "Female",
    lastVisit: "2026-03-06",
    bloodPressure: "112/72",
    bmi: "20.9",
    temperature: "36.5",
    heartRate: "68",
    riskLevel: "Low Risk",
  },
  {
    id: "pat-006",
    patientId: "PAT-0064",
    fullName: "Angelo Flores",
    age: 62,
    gender: "Male",
    lastVisit: "2026-03-05",
    bloodPressure: "160/100",
    bmi: "31.2",
    temperature: "38.2",
    heartRate: "104",
    riskLevel: "High Risk",
  },
];

const defaultMedicines = [
  {
    id: "med-001",
    medicineId: "MED-0001",
    medicineName: "Amoxicillin 500mg",
    category: "Antibiotic",
    stockQuantity: 8,
    unit: "Capsule",
    expirationDate: "2025-08-15",
  },
  {
    id: "med-002",
    medicineId: "MED-0002",
    medicineName: "Metformin 850mg",
    category: "Antidiabetic",
    stockQuantity: 15,
    unit: "Tablet",
    expirationDate: "2025-12-01",
  },
  {
    id: "med-003",
    medicineId: "MED-0003",
    medicineName: "Losartan 50mg",
    category: "Antihypertensive",
    stockQuantity: 12,
    unit: "Tablet",
    expirationDate: "2025-10-20",
  },
  {
    id: "med-004",
    medicineId: "MED-0004",
    medicineName: "Paracetamol 500mg",
    category: "Analgesic",
    stockQuantity: 850,
    unit: "Tablet",
    expirationDate: "2027-03-01",
  },
  {
    id: "med-005",
    medicineId: "MED-0005",
    medicineName: "Salbutamol Inhaler",
    category: "Bronchodilator",
    stockQuantity: 5,
    unit: "Inhaler",
    expirationDate: "2025-09-10",
  },
  {
    id: "med-006",
    medicineId: "MED-0006",
    medicineName: "Vitamin C 500mg",
    category: "Vitamin/Supplement",
    stockQuantity: 700,
    unit: "Tablet",
    expirationDate: "2026-06-15",
  },
];

const stats = [
  { title: "Total Doctors", value: "24", trend: "+12%", color: "blue" },
  { title: "Total Appointments", value: "147", trend: "+8%", color: "green" },
  { title: "Total Patients", value: "1,284", trend: "+5%", color: "amber" },
  { title: "Total Medicines", value: "312", trend: "-3%", color: "violet", down: true },
];

const appointments = [
  { initials: "MA", name: "Maria Aquino", meta: "Dr. Santos · 9:00 AM · General Consultation", status: "Confirmed" },
  { initials: "JR", name: "Jose Reyes", meta: "Dr. Lim · 10:30 AM · Cardiology", status: "Pending" },
  { initials: "CL", name: "Clara Lopez", meta: "Dr. Reyes · 1:00 PM · Pediatrics", status: "Confirmed" },
  { initials: "MB", name: "Miguel Bautista", meta: "Dr. Cruz · 3:00 PM · Orthopedics", status: "Pending" },
];

const stocks = [
  { name: "Amoxicillin 500mg", meta: "Antibiotic · Expires Aug 2025", left: "8 left" },
  { name: "Metformin 850mg", meta: "Antidiabetic · Expires Dec 2025", left: "15 left" },
  { name: "Salbutamol Inhaler", meta: "Bronchodilator · Expires Sep 2025", left: "5 left" },
  { name: "Losartan 50mg", meta: "Antihypertensive · Expires Oct 2025", left: "12 left" },
];

const patientBars2025 = [52, 60, 74, 68, 88, 79, 56];
const patientBars2024 = [40, 33, 47, 43, 56, 51, 39];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const activityBars = [56, 74, 88, 66, 77, 36, 17];

function loadDoctors() {
  try {
    const raw = localStorage.getItem(DOCTOR_STORAGE_KEY);
    if (!raw) return defaultDoctors;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultDoctors;
    return parsed;
  } catch {
    return defaultDoctors;
  }
}

function saveDoctors(doctors) {
  localStorage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(doctors));
}

function loadPatients() {
  try {
    const raw = localStorage.getItem(PATIENT_STORAGE_KEY);
    if (!raw) return defaultPatients;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPatients;
    return parsed;
  } catch {
    return defaultPatients;
  }
}

function savePatients(patients) {
  localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patients));
}

function loadMedicines() {
  try {
    const raw = localStorage.getItem(MEDICINE_STORAGE_KEY);
    if (!raw) return defaultMedicines;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultMedicines;
    return parsed;
  } catch {
    return defaultMedicines;
  }
}

function saveMedicines(medicines) {
  localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(medicines));
}

function formatVisitDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function parseBloodPressure(value) {
  const match = String(value).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) return null;
  return { systolic: Number(match[1]), diastolic: Number(match[2]) };
}

function toneByBloodPressure(value) {
  const parsed = parseBloodPressure(value);
  if (!parsed) return "warn";
  if (parsed.systolic >= 140 || parsed.diastolic >= 90) return "high";
  if (parsed.systolic >= 130 || parsed.diastolic >= 85) return "moderate";
  return "low";
}

function toneByBmi(value) {
  const bmi = Number(value);
  if (Number.isNaN(bmi)) return "warn";
  if (bmi >= 30 || bmi < 17) return "high";
  if (bmi >= 25 || bmi < 18.5) return "moderate";
  return "low";
}

function toneByTemperature(value) {
  const temp = Number(value);
  if (Number.isNaN(temp)) return "warn";
  if (temp >= 38 || temp < 35.8) return "high";
  if (temp >= 37.3 || temp < 36.2) return "moderate";
  return "low";
}

function toneByHeartRate(value) {
  const rate = Number(value);
  if (Number.isNaN(rate)) return "warn";
  if (rate >= 100 || rate < 50) return "high";
  if (rate >= 90 || rate < 60) return "moderate";
  return "low";
}

function computeRiskLevel({ bloodPressure, bmi, temperature, heartRate }) {
  let score = 0;
  const tones = [
    toneByBloodPressure(bloodPressure),
    toneByBmi(bmi),
    toneByTemperature(temperature),
    toneByHeartRate(heartRate),
  ];

  tones.forEach((tone) => {
    if (tone === "high") score += 2;
    if (tone === "moderate") score += 1;
  });

  if (score >= 4) return "High Risk";
  if (score >= 2) return "Moderate";
  return "Low Risk";
}

function riskTone(level) {
  if (level === "High Risk") return "high";
  if (level === "Moderate") return "moderate";
  return "low";
}

function getStockStatus(quantity) {
  const value = Number(quantity);
  if (value <= 5) return "Critical";
  if (value <= 20) return "Low Stock";
  return "Sufficient";
}

function getStockTone(quantity) {
  const status = getStockStatus(quantity);
  if (status === "Critical") return "high";
  if (status === "Low Stock") return "moderate";
  return "low";
}

function getDaysUntilExpiration(expirationDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(expirationDate);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpirationTone(expirationDate) {
  const days = getDaysUntilExpiration(expirationDate);
  if (days < 0) return "expired";
  if (days <= 30) return "warning";
  return "normal";
}

function getCategoryTone(category) {
  const map = {
    Antibiotic: "red",
    Antidiabetic: "yellow",
    Antihypertensive: "indigo",
    Analgesic: "green",
    Bronchodilator: "purple",
    "Vitamin/Supplement": "blue",
  };
  return map[category] || "blue";
}

function createMedicineCode(medicines) {
  const next = medicines.length + 1;
  return `MED-${String(next).padStart(4, "0")}`;
}

function getInitials(name) {
  const parts = name.replace("Dr.", "").trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
}

function getSpecializationTone(label) {
  const map = {
    "General Medicine": "blue",
    Cardiology: "purple",
    Pediatrics: "green",
    Orthopedics: "yellow",
    "Internal Medicine": "indigo",
    Dermatology: "red",
  };
  return map[label] || "blue";
}

function getAvatarTone(index) {
  const tones = ["blue", "purple", "green", "yellow", "cyan", "red"];
  return tones[index % tones.length];
}

function createDoctorCode(doctors) {
  const next = doctors.length + 1;
  return `DOC-${String(next).padStart(4, "0")}`;
}

function DashboardChart() {
  const max = Math.max(...patientBars2025);

  return (
    <div className="bar-chart">
      {days.map((day, index) => (
        <div key={day} className="bar-pair">
          <div className="bars">
            <span style={{ height: `${(patientBars2024[index] / max) * 100}%` }} className="bar bar-2024" />
            <span style={{ height: `${(patientBars2025[index] / max) * 100}%` }} className="bar bar-2025" />
          </div>
          <small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}</small>
        </div>
      ))}
    </div>
  );
}

function ActivityChart() {
  const max = Math.max(...activityBars);

  return (
    <div className="activity-chart">
      {activityBars.map((value, index) => (
        <div key={days[index]} className="activity-bar-wrap">
          <span
            className={`activity-bar ${index === 5 ? "warn" : ""} ${index === 6 ? "muted" : ""}`}
            style={{ height: `${(value / max) * 100}%` }}
          />
          <small>{days[index]}</small>
        </div>
      ))}
    </div>
  );
}

function DoughnutChart() {
  return (
    <div className="doughnut-wrap">
      <div className="doughnut">
        <div className="doughnut-center">
          <strong>147</strong>
          <span>Total</span>
        </div>
      </div>
      <ul>
        <li><span className="dot completed" />Completed <b>66</b></li>
        <li><span className="dot pending" />Pending <b>33</b></li>
        <li><span className="dot cancelled" />Cancelled <b>27</b></li>
        <li><span className="dot confirmed" />Confirmed <b>21</b></li>
      </ul>
    </div>
  );
}

function DashboardHome() {
  return (
    <>
      <div className="hero-row">
        <div>
          <h3>Good morning, Administrator</h3>
          <p>Here&apos;s what&apos;s happening at VitalKey Health Center today.</p>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn-muted">Export Report</button>
          <button type="button" className="btn-primary">+ New Appointment</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <article key={item.title} className={`stat-card ${item.color}`}>
            <p className={`trend ${item.down ? "down" : ""}`}>{item.down ? "↓" : "↑"} {item.trend.replace("+", "")}</p>
            <strong>{item.value}</strong>
            <span>{item.title}</span>
          </article>
        ))}
      </div>

      <div className="insight-grid">
        <section className="panel large">
          <div className="panel-head">
            <div>
              <h4>Patient Visit Trends</h4>
              <p>Monthly comparison - 2024 vs 2025</p>
            </div>
            <div className="legend"><span className="y2025" />2025 <span className="y2024" />2024</div>
          </div>
          <DashboardChart />
        </section>

        <section className="panel large">
          <h4>Appointment Activity</h4>
          <p>This week&apos;s booking volume</p>
          <ActivityChart />
        </section>

        <section className="panel small">
          <h4>Status Breakdown</h4>
          <p>Current period</p>
          <DoughnutChart />
        </section>
      </div>

      <div className="list-grid">
        <section className="panel">
          <div className="panel-head spread">
            <div>
              <h4>Recent Appointments</h4>
              <p>Today&apos;s schedule</p>
            </div>
            <button type="button" className="text-btn">View all →</button>
          </div>

          <div className="rows">
            {appointments.map((item) => (
              <article key={item.name} className="row-item">
                <span className="avatar-sm">{item.initials}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.meta}</p>
                </div>
                <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head spread">
            <div>
              <h4>Low Stock Alert</h4>
              <p>Medicines needing restock</p>
            </div>
            <button type="button" className="text-btn">Manage →</button>
          </div>

          <div className="rows">
            {stocks.map((item) => (
              <article key={item.name} className="row-item">
                <span className="warn-dot">!</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.meta}</p>
                </div>
                <span className="left-pill">{item.left}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function HealthCenterSettings() {
  const [config, setConfig] = useState(() => loadClinicConfig());
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const weeklySchedule = useMemo(() => buildWeeklySchedule(config), [config]);
  const dailyHours = useMemo(() => getDailyOperatingHours(config), [config]);

  const consultationPreset = useMemo(() => {
    const daysKey = config.consultationDays.join("|");
    if (daysKey === DAY_PRESETS.mon_fri.join("|")) return "mon_fri";
    if (daysKey === DAY_PRESETS.mon_sat.join("|")) return "mon_sat";
    if (daysKey === DAY_PRESETS.daily.join("|")) return "daily";
    return "mon_fri";
  }, [config.consultationDays]);

  const validationExamples = useMemo(
    () => [
      { label: "Saturday 10:00 AM", result: validateAppointmentSlot({ day: "Saturday", time: "10:00" }, config) },
      { label: "Tuesday 7:00 PM", result: validateAppointmentSlot({ day: "Tuesday", time: "19:00" }, config) },
      { label: "Wednesday 10:00 AM", result: validateAppointmentSlot({ day: "Wednesday", time: "10:00" }, config) },
    ],
    [config],
  );

  function updateField(field, value) {
    setSaveMessage("");
    setSaveError("");
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!dailyHours) {
      setSaveError("Closing time must be later than opening time.");
      setSaveMessage("");
      return;
    }

    const saved = saveClinicConfig(config);
    setConfig(saved);
    setSaveError("");
    setSaveMessage("Configuration saved. Appointment scheduling now follows these settings.");
  }

  return (
    <div className="settings-shell">
      <div className="settings-header">
        <div>
          <h3>Health Center Settings</h3>
          <p>Configure health center information, schedule, and system preferences.</p>
        </div>
        <div className="settings-actions">
          <button type="button" className="btn-primary" onClick={handleSave}>Save Changes</button>
          {saveMessage ? <small className="save-note ok">{saveMessage}</small> : null}
          {saveError ? <small className="save-note err">{saveError}</small> : null}
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-left">
          <section className="panel settings-card">
            <h4>Health Center Information</h4>
            <p>Basic center details displayed across the system.</p>

            <div className="setting-field">
              <label htmlFor="centerName">Health Center Name</label>
              <div className="field-box">
                <input
                  id="centerName"
                  className="field-control"
                  value={config.centerName}
                  onChange={(event) => updateField("centerName", event.target.value)}
                />
              </div>
            </div>

            <div className="setting-field">
              <label htmlFor="address">Address</label>
              <div className="field-box">
                <input
                  id="address"
                  className="field-control"
                  value={config.address}
                  onChange={(event) => updateField("address", event.target.value)}
                />
              </div>
            </div>

            <div className="settings-two-col">
              <div className="setting-field">
                <label htmlFor="contactNumber">Contact Number</label>
                <div className="field-box">
                  <input
                    id="contactNumber"
                    className="field-control"
                    value={config.contactNumber}
                    onChange={(event) => updateField("contactNumber", event.target.value)}
                  />
                </div>
              </div>
              <div className="setting-field">
                <label htmlFor="email">Email</label>
                <div className="field-box">
                  <input
                    id="email"
                    className="field-control"
                    value={config.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="panel settings-card">
            <h4>Consultation Hours</h4>
            <p>Set the center&apos;s daily operating schedule.</p>

            <div className="settings-two-col">
              <div className="setting-field">
                <label htmlFor="openingTime">Opening Time</label>
                <div className="field-box">
                  <input
                    id="openingTime"
                    type="time"
                    className="field-control"
                    value={config.openingTime}
                    onChange={(event) => updateField("openingTime", event.target.value)}
                  />
                </div>
              </div>
              <div className="setting-field">
                <label htmlFor="closingTime">Closing Time</label>
                <div className="field-box">
                  <input
                    id="closingTime"
                    type="time"
                    className="field-control"
                    value={config.closingTime}
                    onChange={(event) => updateField("closingTime", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="setting-field">
              <label htmlFor="consultationDays">Consultation Days</label>
              <div className="field-box">
                <select
                  id="consultationDays"
                  className="field-control"
                  value={consultationPreset}
                  onChange={(event) => updateField("consultationDays", DAY_PRESETS[event.target.value])}
                >
                  <option value="mon_fri">Monday to Friday</option>
                  <option value="mon_sat">Monday to Saturday</option>
                  <option value="daily">Monday to Sunday</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="settings-right">
          <section className="panel settings-card">
            <h4>Weekly Schedule Preview</h4>
            <p>Current health center operating days and hours.</p>

            <div className="schedule-list">
              {weeklySchedule.map((item) => (
                <article className="schedule-row" key={item.day}>
                  <strong>{item.day}</strong>
                  <span>{item.hours}</span>
                  <em className={item.open ? "open" : "closed"}>{item.open ? "• Open" : "• Closed"}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-card">
            <h4>Health Center Overview</h4>
            <p>Summary of current configuration.</p>

            <div className="overview-grid">
              <div>
                <span>HEALTH CENTER NAME</span>
                <strong>{config.centerName}</strong>
              </div>
              <div>
                <span>OPERATING DAYS</span>
                <strong>{weeklySchedule.filter((row) => row.open).length} day(s) active</strong>
              </div>
              <div>
                <span>OPENING TIME</span>
                <strong>{formatTime(config.openingTime)}</strong>
              </div>
              <div>
                <span>CLOSING TIME</span>
                <strong>{formatTime(config.closingTime)}</strong>
              </div>
              <div>
                <span>CONTACT</span>
                <strong>{config.contactNumber}</strong>
              </div>
              <div>
                <span>TOTAL HOURS/DAY</span>
                <strong>{dailyHours || 0} hours</strong>
              </div>
            </div>

            <div className="logic-box">
              <strong>Appointment Validation Rules</strong>
              <p>Booking is allowed only on active consultation days and within opening-closing time.</p>
              <div className="logic-examples">
                {validationExamples.map((sample) => (
                  <p key={sample.label}>
                    {sample.label}: <b className={sample.result.allowed ? "ok" : "err"}>{sample.result.allowed ? "Allowed" : "Not allowed"}</b>
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DoctorManagement() {
  const [doctors, setDoctors] = useState(() => loadDoctors());
  const [query, setQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    contactNumber: "",
    schedule: "",
    status: "Active",
  });

  const specializations = useMemo(() => {
    const values = new Set(doctors.map((doctor) => doctor.specialization));
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSearch = !q
        || doctor.name.toLowerCase().includes(q)
        || doctor.specialization.toLowerCase().includes(q);
      const matchesSpec = specializationFilter === "all" || doctor.specialization === specializationFilter;
      const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;
      return matchesSearch && matchesSpec && matchesStatus;
    });
  }, [doctors, query, specializationFilter, statusFilter]);

  function openAddModal() {
    setEditingId(null);
    setForm({
      name: "",
      specialization: "",
      contactNumber: "",
      schedule: "",
      status: "Active",
    });
    setModalOpen(true);
  }

  function openEditModal(doctor) {
    setEditingId(doctor.id);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      contactNumber: doctor.contactNumber,
      schedule: doctor.schedule,
      status: doctor.status,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveDoctor(event) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      contactNumber: form.contactNumber.trim(),
      schedule: form.schedule.trim(),
      status: form.status,
    };

    if (!payload.name || !payload.specialization || !payload.contactNumber || !payload.schedule) {
      return;
    }

    if (editingId) {
      const next = doctors.map((doctor) => (doctor.id === editingId ? { ...doctor, ...payload } : doctor));
      setDoctors(next);
      saveDoctors(next);
      closeModal();
      return;
    }

    const code = createDoctorCode(doctors);
    const next = [
      ...doctors,
      {
        id: `doc-${Date.now()}`,
        code,
        ...payload,
      },
    ];

    setDoctors(next);
    saveDoctors(next);
    closeModal();
  }

  function handleDeleteDoctor(doctorId) {
    const target = doctors.find((doctor) => doctor.id === doctorId);
    if (!target) return;

    const confirmed = window.confirm(`Delete ${target.name}?`);
    if (!confirmed) return;

    const next = doctors.filter((doctor) => doctor.id !== doctorId);
    setDoctors(next);
    saveDoctors(next);
  }

  return (
    <div className="doctor-shell">
      <div className="doctor-header">
        <div>
          <h3>Doctor Management</h3>
          <p>Manage clinic physicians, specialists, and their schedules.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openAddModal}>+ Add Doctor</button>
      </div>

      <div className="doctor-filters">
        <input
          className="doctor-search"
          placeholder="Search doctors..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          className="doctor-select"
          value={specializationFilter}
          onChange={(event) => setSpecializationFilter(event.target.value)}
        >
          <option value="all">All Specializations</option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>{specialization}</option>
          ))}
        </select>

        <select
          className="doctor-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      <section className="doctor-table-wrap panel">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Contact Number</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor, index) => (
              <tr key={doctor.id}>
                <td>
                  <div className="doctor-cell">
                    <span className={`doctor-avatar ${getAvatarTone(index)}`}>{getInitials(doctor.name)}</span>
                    <div>
                      <strong>{doctor.name}</strong>
                      <small>{doctor.code}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`spec-pill ${getSpecializationTone(doctor.specialization)}`}>{doctor.specialization}</span>
                </td>
                <td>{doctor.contactNumber}</td>
                <td>{doctor.schedule}</td>
                <td>
                  <span className={`status-pill ${doctor.status === "Active" ? "active" : "leave"}`}>{doctor.status}</span>
                </td>
                <td>
                  <div className="doctor-actions">
                    <button type="button" className="edit-btn" onClick={() => openEditModal(doctor)}>Edit</button>
                    <button type="button" className="delete-btn" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredDoctors.length ? (
              <tr>
                <td colSpan={6} className="doctor-empty">No doctors found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {modalOpen ? (
        <div className="doctor-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="doctor-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h4>{editingId ? "Edit Doctor" : "Add Doctor"}</h4>
            <form className="doctor-form" onSubmit={handleSaveDoctor}>
              <label htmlFor="doctorName">Doctor Name</label>
              <input
                id="doctorName"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                required
              />

              <label htmlFor="doctorSpec">Specialization</label>
              <input
                id="doctorSpec"
                value={form.specialization}
                onChange={(event) => handleFormChange("specialization", event.target.value)}
                required
              />

              <label htmlFor="doctorContact">Contact Number</label>
              <input
                id="doctorContact"
                value={form.contactNumber}
                onChange={(event) => handleFormChange("contactNumber", event.target.value)}
                required
              />

              <label htmlFor="doctorSchedule">Schedule</label>
              <input
                id="doctorSchedule"
                value={form.schedule}
                onChange={(event) => handleFormChange("schedule", event.target.value)}
                required
              />

              <label htmlFor="doctorStatus">Status</label>
              <select
                id="doctorStatus"
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>

              <div className="doctor-form-actions">
                <button type="button" className="btn-muted" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PatientRecords() {
  const [patients, setPatients] = useState(() => loadPatients());
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    patientId: "",
    age: "",
    gender: "Female",
    lastVisit: "",
    bloodPressure: "",
    bmi: "",
    temperature: "",
    heartRate: "",
    riskMode: "Auto",
    riskLevel: "Low Risk",
  });

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch = !q
        || patient.fullName.toLowerCase().includes(q)
        || patient.patientId.toLowerCase().includes(q);
      const matchesRisk = riskFilter === "all" || patient.riskLevel === riskFilter;
      const matchesGender = genderFilter === "all" || patient.gender === genderFilter;
      return matchesSearch && matchesRisk && matchesGender;
    });
  }, [patients, query, riskFilter, genderFilter]);

  function openAddModal() {
    setForm({
      fullName: "",
      patientId: "",
      age: "",
      gender: "Female",
      lastVisit: "",
      bloodPressure: "",
      bmi: "",
      temperature: "",
      heartRate: "",
      riskMode: "Auto",
      riskLevel: "Low Risk",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSavePatient(event) {
    event.preventDefault();
    if (
      !form.fullName.trim()
      || !form.patientId.trim()
      || !String(form.age).trim()
      || !form.lastVisit
      || !form.bloodPressure.trim()
      || !form.bmi.trim()
      || !form.temperature.trim()
      || !form.heartRate.trim()
    ) {
      return;
    }

    const payload = {
      id: `pat-${Date.now()}`,
      patientId: form.patientId.trim(),
      fullName: form.fullName.trim(),
      age: Number(form.age),
      gender: form.gender,
      lastVisit: form.lastVisit,
      bloodPressure: form.bloodPressure.trim(),
      bmi: form.bmi.trim(),
      temperature: form.temperature.trim(),
      heartRate: form.heartRate.trim(),
    };

    const resolvedRisk = form.riskMode === "Manual"
      ? form.riskLevel
      : computeRiskLevel(payload);

    const next = [...patients, { ...payload, riskLevel: resolvedRisk }];
    setPatients(next);
    savePatients(next);
    closeModal();
  }

  function handleExportCsv() {
    const rows = [
      ["Patient ID", "Full Name", "Age", "Gender", "Last Visit", "Blood Pressure", "BMI", "Temperature", "Heart Rate", "Risk Level"],
      ...filteredPatients.map((patient) => [
        patient.patientId,
        patient.fullName,
        patient.age,
        patient.gender,
        formatVisitDate(patient.lastVisit),
        patient.bloodPressure,
        patient.bmi,
        patient.temperature,
        `${patient.heartRate} bpm`,
        patient.riskLevel,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patient-records.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="patient-shell">
      <div className="patient-header">
        <div>
          <h3>Patient Records</h3>
          <p>Health profiles and kiosk-collected biometric measurements.</p>
        </div>
        <div className="patient-actions">
          <button type="button" className="btn-muted" onClick={handleExportCsv}>Export</button>
          <button type="button" className="btn-primary" onClick={openAddModal}>+ Add Patient</button>
        </div>
      </div>

      <div className="patient-filters">
        <input
          className="patient-search"
          placeholder="Search patients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          className="patient-select"
          value={riskFilter}
          onChange={(event) => setRiskFilter(event.target.value)}
        >
          <option value="all">All Risk Levels</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Moderate">Moderate</option>
          <option value="High Risk">High Risk</option>
        </select>

        <select
          className="patient-select"
          value={genderFilter}
          onChange={(event) => setGenderFilter(event.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
      </div>

      <section className="patient-table-wrap panel">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age / Gender</th>
              <th>Last Visit</th>
              <th>Blood Pressure</th>
              <th>BMI</th>
              <th>Temp (°C)</th>
              <th>Heart Rate</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr key={patient.id}>
                <td>
                  <div className="doctor-cell">
                    <span className={`doctor-avatar ${getAvatarTone(index)}`}>{getInitials(patient.fullName)}</span>
                    <div>
                      <strong>{patient.fullName}</strong>
                      <small>{patient.patientId}</small>
                    </div>
                  </div>
                </td>
                <td>{patient.age} yrs · {patient.gender}</td>
                <td>{formatVisitDate(patient.lastVisit)}</td>
                <td><span className={`metric-pill ${toneByBloodPressure(patient.bloodPressure)}`}>{patient.bloodPressure}</span></td>
                <td><span className={`metric-pill ${toneByBmi(patient.bmi)}`}>{patient.bmi}</span></td>
                <td><span className={`metric-pill ${toneByTemperature(patient.temperature)}`}>{patient.temperature}</span></td>
                <td><span className={`metric-pill ${toneByHeartRate(patient.heartRate)}`}>{patient.heartRate} bpm</span></td>
                <td><span className={`status-pill ${riskTone(patient.riskLevel)}`}>{patient.riskLevel}</span></td>
              </tr>
            ))}
            {!filteredPatients.length ? (
              <tr>
                <td colSpan={8} className="doctor-empty">No patient records found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {modalOpen ? (
        <div className="doctor-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="doctor-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h4>Add Patient</h4>
            <form className="doctor-form" onSubmit={handleSavePatient}>
              <label htmlFor="patientName">Full Name</label>
              <input id="patientName" value={form.fullName} onChange={(event) => handleFormChange("fullName", event.target.value)} required />

              <label htmlFor="patientId">Patient ID</label>
              <input id="patientId" value={form.patientId} onChange={(event) => handleFormChange("patientId", event.target.value)} required />

              <label htmlFor="patientAge">Age</label>
              <input id="patientAge" type="number" min={0} value={form.age} onChange={(event) => handleFormChange("age", event.target.value)} required />

              <label htmlFor="patientGender">Gender</label>
              <select id="patientGender" value={form.gender} onChange={(event) => handleFormChange("gender", event.target.value)}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>

              <label htmlFor="patientVisit">Last Visit</label>
              <input id="patientVisit" type="date" value={form.lastVisit} onChange={(event) => handleFormChange("lastVisit", event.target.value)} required />

              <label htmlFor="patientBp">Blood Pressure</label>
              <input id="patientBp" placeholder="120/80" value={form.bloodPressure} onChange={(event) => handleFormChange("bloodPressure", event.target.value)} required />

              <label htmlFor="patientBmi">BMI</label>
              <input id="patientBmi" placeholder="22.4" value={form.bmi} onChange={(event) => handleFormChange("bmi", event.target.value)} required />

              <label htmlFor="patientTemp">Temperature</label>
              <input id="patientTemp" placeholder="36.7" value={form.temperature} onChange={(event) => handleFormChange("temperature", event.target.value)} required />

              <label htmlFor="patientHeartRate">Heart Rate</label>
              <input id="patientHeartRate" placeholder="72" value={form.heartRate} onChange={(event) => handleFormChange("heartRate", event.target.value)} required />

              <label htmlFor="riskMode">Risk Assignment</label>
              <select id="riskMode" value={form.riskMode} onChange={(event) => handleFormChange("riskMode", event.target.value)}>
                <option value="Auto">Auto Compute</option>
                <option value="Manual">Manual</option>
              </select>

              {form.riskMode === "Manual" ? (
                <>
                  <label htmlFor="manualRisk">Risk Level</label>
                  <select id="manualRisk" value={form.riskLevel} onChange={(event) => handleFormChange("riskLevel", event.target.value)}>
                    <option value="Low Risk">Low Risk</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High Risk">High Risk</option>
                  </select>
                </>
              ) : null}

              <div className="doctor-form-actions">
                <button type="button" className="btn-muted" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MedicineCatalog() {
  const [medicines, setMedicines] = useState(() => loadMedicines());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    medicineName: "",
    medicineId: "",
    category: "Antibiotic",
    stockQuantity: "",
    unit: "Tablet",
    expirationDate: "",
  });

  const categories = useMemo(() => {
    const values = new Set(medicines.map((medicine) => medicine.category));
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicines.filter((medicine) => {
      const matchesSearch = !q
        || medicine.medicineName.toLowerCase().includes(q)
        || medicine.category.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter;
      const matchesStock = stockFilter === "all" || getStockStatus(medicine.stockQuantity) === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [medicines, query, categoryFilter, stockFilter]);

  function openAddModal() {
    setEditingId(null);
    setForm({
      medicineName: "",
      medicineId: createMedicineCode(medicines),
      category: "Antibiotic",
      stockQuantity: "",
      unit: "Tablet",
      expirationDate: "",
    });
    setModalOpen(true);
  }

  function openEditModal(medicine) {
    setEditingId(medicine.id);
    setForm({
      medicineName: medicine.medicineName,
      medicineId: medicine.medicineId,
      category: medicine.category,
      stockQuantity: String(medicine.stockQuantity),
      unit: medicine.unit,
      expirationDate: medicine.expirationDate,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveMedicine(event) {
    event.preventDefault();
    if (
      !form.medicineName.trim()
      || !form.medicineId.trim()
      || !form.category.trim()
      || !String(form.stockQuantity).trim()
      || !form.unit.trim()
      || !form.expirationDate
    ) {
      return;
    }

    const payload = {
      medicineName: form.medicineName.trim(),
      medicineId: form.medicineId.trim(),
      category: form.category.trim(),
      stockQuantity: Number(form.stockQuantity),
      unit: form.unit.trim(),
      expirationDate: form.expirationDate,
    };

    if (editingId) {
      const next = medicines.map((medicine) => (medicine.id === editingId ? { ...medicine, ...payload } : medicine));
      setMedicines(next);
      saveMedicines(next);
      closeModal();
      return;
    }

    const next = [...medicines, { id: `med-${Date.now()}`, ...payload }];
    setMedicines(next);
    saveMedicines(next);
    closeModal();
  }

  function handleDeleteMedicine(medicineId) {
    const target = medicines.find((medicine) => medicine.id === medicineId);
    if (!target) return;
    const confirmed = window.confirm(`Delete ${target.medicineName}?`);
    if (!confirmed) return;

    const next = medicines.filter((medicine) => medicine.id !== medicineId);
    setMedicines(next);
    saveMedicines(next);
  }

  function handleExportCsv() {
    const rows = [
      ["Medicine Name", "Medicine ID", "Category", "Stock Quantity", "Unit", "Expiration Date", "Stock Status"],
      ...filteredMedicines.map((medicine) => [
        medicine.medicineName,
        medicine.medicineId,
        medicine.category,
        medicine.stockQuantity,
        medicine.unit,
        formatVisitDate(medicine.expirationDate),
        getStockStatus(medicine.stockQuantity),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medicine-catalog.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="medicine-shell">
      <div className="medicine-header">
        <div>
          <h3>Medicine Catalog</h3>
          <p>Inventory of clinic medications, stock levels, and expiration tracking.</p>
        </div>
        <div className="medicine-actions">
          <button type="button" className="btn-muted" onClick={handleExportCsv}>Export</button>
          <button type="button" className="btn-primary" onClick={openAddModal}>+ Add Medicine</button>
        </div>
      </div>

      <div className="medicine-filters">
        <input
          className="medicine-search"
          placeholder="Search medicines..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select className="medicine-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select className="medicine-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
          <option value="all">All Stock Status</option>
          <option value="Critical">Critical</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Sufficient">Sufficient</option>
        </select>
      </div>

      <section className="medicine-table-wrap panel">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Stock Quantity</th>
              <th>Unit</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>
                  <div className="medicine-cell">
                    <strong>{medicine.medicineName}</strong>
                    <small>{medicine.medicineId}</small>
                  </div>
                </td>
                <td><span className={`spec-pill ${getCategoryTone(medicine.category)}`}>{medicine.category}</span></td>
                <td>
                  <div className="stock-cell">
                    <div className="stock-bar-track">
                      <span
                        className={`stock-bar ${getStockTone(medicine.stockQuantity)}`}
                        style={{ width: `${Math.min(100, Number(medicine.stockQuantity) / 8)}%` }}
                      />
                    </div>
                    <b>{medicine.stockQuantity}</b>
                  </div>
                </td>
                <td>{medicine.unit}</td>
                <td>
                  <span className={`expiry-date ${getExpirationTone(medicine.expirationDate)}`}>
                    {formatVisitDate(medicine.expirationDate)}
                  </span>
                </td>
                <td><span className={`status-pill ${getStockTone(medicine.stockQuantity)}`}>{getStockStatus(medicine.stockQuantity)}</span></td>
                <td>
                  <div className="doctor-actions">
                    <button type="button" className="edit-btn" onClick={() => openEditModal(medicine)}>Edit</button>
                    <button type="button" className="delete-btn" onClick={() => handleDeleteMedicine(medicine.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredMedicines.length ? (
              <tr>
                <td colSpan={7} className="doctor-empty">No medicines found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {modalOpen ? (
        <div className="doctor-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="doctor-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h4>{editingId ? "Edit Medicine" : "Add Medicine"}</h4>
            <form className="doctor-form" onSubmit={handleSaveMedicine}>
              <label htmlFor="medicineName">Medicine Name</label>
              <input id="medicineName" value={form.medicineName} onChange={(event) => handleFormChange("medicineName", event.target.value)} required />

              <label htmlFor="medicineCode">Medicine ID</label>
              <input id="medicineCode" value={form.medicineId} onChange={(event) => handleFormChange("medicineId", event.target.value)} required />

              <label htmlFor="medicineCategory">Category</label>
              <select id="medicineCategory" value={form.category} onChange={(event) => handleFormChange("category", event.target.value)}>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Antihypertensive">Antihypertensive</option>
                <option value="Analgesic">Analgesic</option>
                <option value="Bronchodilator">Bronchodilator</option>
                <option value="Vitamin/Supplement">Vitamin/Supplement</option>
              </select>

              <label htmlFor="medicineStock">Stock Quantity</label>
              <input id="medicineStock" type="number" min={0} value={form.stockQuantity} onChange={(event) => handleFormChange("stockQuantity", event.target.value)} required />

              <label htmlFor="medicineUnit">Unit</label>
              <select id="medicineUnit" value={form.unit} onChange={(event) => handleFormChange("unit", event.target.value)}>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Vial">Vial</option>
              </select>

              <label htmlFor="medicineExpiry">Expiration Date</label>
              <input id="medicineExpiry" type="date" value={form.expirationDate} onChange={(event) => handleFormChange("expirationDate", event.target.value)} required />

              <div className="doctor-form-actions">
                <button type="button" className="btn-muted" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildReportData(range) {
  const presets = {
    this_month: {
      visits: 1284,
      visitsPrev: 1219,
      appointments: 147,
      appointmentsCompleted: 131,
      medicineUsage: 2841,
      medicinePrev: 2928,
      monthlyVisits: [118, 132, 156, 144, 181, 170, 189, 207],
      outcomes: { Completed: 66, Pending: 33, Confirmed: 21, Cancelled: 27 },
    },
    last_month: {
      visits: 1219,
      visitsPrev: 1142,
      appointments: 136,
      appointmentsCompleted: 117,
      medicineUsage: 2928,
      medicinePrev: 2801,
      monthlyVisits: [109, 124, 141, 136, 162, 158, 173, 190],
      outcomes: { Completed: 58, Pending: 29, Confirmed: 24, Cancelled: 25 },
    },
    last_quarter: {
      visits: 3625,
      visitsPrev: 3320,
      appointments: 428,
      appointmentsCompleted: 377,
      medicineUsage: 8612,
      medicinePrev: 8943,
      monthlyVisits: [382, 401, 436, 452, 470, 489, 501, 494],
      outcomes: { Completed: 194, Pending: 98, Confirmed: 73, Cancelled: 63 },
    },
    this_year: {
      visits: 10124,
      visitsPrev: 9430,
      appointments: 1288,
      appointmentsCompleted: 1124,
      medicineUsage: 24698,
      medicinePrev: 25122,
      monthlyVisits: [901, 944, 990, 1052, 1131, 1098, 1180, 1225],
      outcomes: { Completed: 588, Pending: 274, Confirmed: 197, Cancelled: 229 },
    },
  };

  return presets[range] || presets.this_month;
}

function formatPercentDelta(current, previous) {
  if (!previous) return "0.0%";
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(delta).toFixed(1)}%`;
}

function ReportsAnalytics() {
  const [range, setRange] = useState("this_month");

  const report = useMemo(() => buildReportData(range), [range]);
  const doctors = useMemo(() => loadDoctors(), []);
  const medicines = useMemo(() => loadMedicines(), []);

  const completionRate = useMemo(
    () => (report.appointments ? Math.round((report.appointmentsCompleted / report.appointments) * 100) : 0),
    [report],
  );

  const visitsChange = useMemo(() => formatPercentDelta(report.visits, report.visitsPrev), [report]);
  const medicineChange = useMemo(() => formatPercentDelta(report.medicineUsage, report.medicinePrev), [report]);

  const topDoctors = useMemo(() => {
    const completedBase = report.outcomes.Completed || 1;
    const rows = doctors.map((doctor, index) => {
      const appointmentsCount = Math.max(12, Math.round((completedBase / doctors.length) * (1.35 - index * 0.12)));
      const rate = Math.max(82, 98 - index * 3);
      return {
        name: doctor.name,
        specialization: doctor.specialization,
        appointments: appointmentsCount,
        completionRate: rate,
      };
    });
    return rows.sort((a, b) => b.appointments - a.appointments).slice(0, 5);
  }, [doctors, report]);

  const medicineSummary = useMemo(() => {
    const rows = medicines.map((medicine, index) => ({
      medicineName: medicine.medicineName,
      category: medicine.category,
      unitsUsed: Math.max(40, Math.round((report.medicineUsage / (index + 4)) * 0.56)),
      stockLeft: medicine.stockQuantity,
    }));
    return rows.sort((a, b) => b.unitsUsed - a.unitsUsed).slice(0, 5);
  }, [medicines, report]);

  function handleDownloadReport() {
    const rows = [
      ["Reports & Analytics", new Date().toISOString()],
      [],
      ["Time Range", range],
      ["Patient Visits", report.visits],
      ["Appointments", report.appointments],
      ["Appointments Completion Rate", `${completionRate}%`],
      ["Medicine Usage", report.medicineUsage],
      [],
      ["Top Performing Doctors"],
      ["Doctor", "Specialization", "Appointments", "Completion Rate"],
      ...topDoctors.map((item) => [item.name, item.specialization, item.appointments, `${item.completionRate}%`]),
      [],
      ["Medicine Usage Summary"],
      ["Medicine", "Category", "Units Used", "Stock Left"],
      ...medicineSummary.map((item) => [item.medicineName, item.category, item.unitsUsed, item.stockLeft]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reports-analytics-${range}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const rangeLabelMap = {
    this_month: "This Month",
    last_month: "Last Month",
    last_quarter: "Last Quarter",
    this_year: "This Year",
  };

  return (
    <div className="reports-shell">
      <div className="reports-header">
        <div>
          <h3>Reports & Analytics</h3>
          <p>Statistical summaries and performance insights for the clinic.</p>
        </div>
        <div className="reports-actions">
          <select className="reports-select" value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <button type="button" className="btn-primary" onClick={handleDownloadReport}>Download Report</button>
        </div>
      </div>

      <div className="reports-cards">
        <article className="panel report-card">
          <p className="report-card-title">Patient Visits</p>
          <strong>{report.visits.toLocaleString()}</strong>
          <span>Total visits this period</span>
          <small>{visitsChange} compared to previous period</small>
        </article>
        <article className="panel report-card">
          <p className="report-card-title">Appointments</p>
          <strong>{report.appointments.toLocaleString()}</strong>
          <span>Total appointments booked</span>
          <small>{completionRate}% completion rate</small>
        </article>
        <article className="panel report-card">
          <p className="report-card-title">Medicine Usage</p>
          <strong>{report.medicineUsage.toLocaleString()}</strong>
          <span>Units dispensed this period</span>
          <small>{medicineChange} vs previous period</small>
        </article>
      </div>

      <div className="reports-chart-grid">
        <section className="panel">
          <div className="report-panel-head">
            <h4>Monthly Patient Visits</h4>
            <p>{rangeLabelMap[range]}</p>
          </div>
          <div className="monthly-bars">
            {report.monthlyVisits.map((value, index) => (
              <div key={`${value}-${index}`} className="monthly-bar-item">
                <span style={{ height: `${Math.max(18, Math.round((value / Math.max(...report.monthlyVisits)) * 100))}%` }} className="monthly-bar" />
                <small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="report-panel-head">
            <h4>Appointment Outcomes</h4>
            <p>Distribution by status</p>
          </div>
          <div className="outcome-bars">
            <div className="outcome-segment completed" style={{ flex: report.outcomes.Completed }}><small>Completed</small></div>
            <div className="outcome-segment pending" style={{ flex: report.outcomes.Pending }}><small>Pending</small></div>
            <div className="outcome-segment confirmed" style={{ flex: report.outcomes.Confirmed }}><small>Confirmed</small></div>
            <div className="outcome-segment cancelled" style={{ flex: report.outcomes.Cancelled }}><small>Cancelled</small></div>
          </div>
        </section>
      </div>

      <div className="reports-table-grid">
        <section className="panel">
          <div className="report-panel-head">
            <h4>Top Performing Doctors</h4>
            <p>By completed appointments ({rangeLabelMap[range]})</p>
          </div>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Appointments</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td>
                    <div className="doctor-cell">
                      <span className={`doctor-avatar ${getAvatarTone(index)}`}>{getInitials(item.name)}</span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td><span className={`spec-pill ${getSpecializationTone(item.specialization)}`}>{item.specialization}</span></td>
                  <td>{item.appointments}</td>
                  <td><span className="metric-pill low">{item.completionRate}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="report-panel-head">
            <h4>Medicine Usage Summary</h4>
            <p>Top dispensed medications ({rangeLabelMap[range]})</p>
          </div>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Units Used</th>
                <th>Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {medicineSummary.map((item, index) => (
                <tr key={`${item.medicineName}-${index}`}>
                  <td><strong>{item.medicineName}</strong></td>
                  <td><span className={`spec-pill ${getCategoryTone(item.category)}`}>{item.category}</span></td>
                  <td>{item.unitsUsed.toLocaleString()}</td>
                  <td><span className={`metric-pill ${getStockTone(item.stockLeft)}`}>{item.stockLeft}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const pageTitleMap = {
    dashboard: "Dashboard",
    settings: "Health Center Settings",
    doctors: "Doctor Management",
    patients: "Patient Records",
    medicines: "Medicine Catalog",
    reports: "Reports & Analytics",
  };

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="logo-box">+</div>
          <div>
            <h1>VitalKey</h1>
            <p>HEALTH CENTER MANAGEMENT</p>
          </div>
        </div>

        <nav className="side-links">
          <p>OVERVIEW</p>
          <button
            className={activePage === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <p>MANAGEMENT</p>
          {sideNav.management.map((label) => {
            const isSettings = label === "Health Center Settings";
            const isDoctors = label === "Doctor Management";
            const isPatients = label === "Patient Records";
            const isMedicines = label === "Medicine Catalog";
            const active = (isSettings && activePage === "settings")
              || (isDoctors && activePage === "doctors")
              || (isPatients && activePage === "patients")
              || (isMedicines && activePage === "medicines");

            return (
              <button
                key={label}
                type="button"
                className={active ? "active" : ""}
                onClick={() => {
                  if (isSettings) setActivePage("settings");
                  if (isDoctors) setActivePage("doctors");
                  if (isPatients) setActivePage("patients");
                  if (isMedicines) setActivePage("medicines");
                }}
              >
                {label}
              </button>
            );
          })}

          <p>ANALYTICS</p>
          <button type="button" className={activePage === "reports" ? "active" : ""} onClick={() => setActivePage("reports")}>
            Reports
          </button>
        </nav>

        <button type="button" className="admin-chip" onClick={onLogout}>
          <span>AD</span>
          <div>
            <strong>Administrator</strong>
            <small>Super Admin · Logout</small>
          </div>
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <h2>{pageTitleMap[activePage]}</h2>
          <div className="topbar-right">
            <span className="date-pill">{today}</span>
            <button type="button" className="notif" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4v-3.2A6 6 0 0 0 13 5.1V4a1 1 0 1 0-2 0v1.1A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 0 1-6 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="avatar">AD</span>
          </div>
        </header>

        {activePage === "settings" ? <HealthCenterSettings /> : null}
        {activePage === "dashboard" ? <DashboardHome /> : null}
        {activePage === "doctors" ? <DoctorManagement /> : null}
        {activePage === "patients" ? <PatientRecords /> : null}
        {activePage === "medicines" ? <MedicineCatalog /> : null}
        {activePage === "reports" ? <ReportsAnalytics /> : null}
      </section>
    </main>
  );
}
