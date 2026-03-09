import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_PATIENTS = [
  { id: 1, patient_code: "P100001", full_name: "Maria Santos", id_number: "104582" },
  { id: 2, patient_code: "P100002", full_name: "John Cruz", id_number: "209731" },
  { id: 3, patient_code: "P100003", full_name: "Ana Reyes", id_number: "887420" },
];

function initialsFromName(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((v) => v[0]?.toUpperCase() || "")
    .join("");
}

export default function PatientIdLookup() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [enteredDigits, setEnteredDigits] = useState("");
  const [showDigits, setShowDigits] = useState(false);
  const [error, setError] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return MOCK_PATIENTS.filter((p) => p.full_name.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const canContinue = enteredDigits.length > 0;

  function handleContinue() {
    if (!canContinue) return;
    const payload = selectedPatient
      ? {
          id: selectedPatient.id,
          patient_code: selectedPatient.patient_code,
          full_name: selectedPatient.full_name,
        }
      : {
          id: 0,
          patient_code: "TEMP",
          full_name: query.trim() || "Guest Patient",
        };
    localStorage.setItem("vk_returning_patient", JSON.stringify(payload));
    navigate("/measure");
  }

  function handleDigit(digit) {
    if (enteredDigits.length >= 10) return;
    setEnteredDigits((prev) => `${prev}${digit}`);
  }

  function handleDelete() {
    setEnteredDigits((prev) => prev.slice(0, -1));
  }

  function handleClear() {
    setEnteredDigits("");
  }

  const displayValue =
    enteredDigits.length === 0 ? "" : showDigits ? enteredDigits : "*".repeat(enteredDigits.length);

  return (
    <div className="pid-root">
      <div className="pid-frame">
        <div className="pid-card">
          <main className="pid-body">
            <section className="pid-left">
              <h1 className="pid-title">Patient Login</h1>
              <p className="pid-subtitle">Find your name, then enter your ID number.</p>

              <div className="pid-search-wrap">
                <input
                  className="pid-input"
                  type="text"
                  placeholder="Find User (Enter Name)"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedPatient(null);
                    setEnteredDigits("");
                    setShowDigits(false);
                    setError("");
                  }}
                />
              </div>

              {results.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  className="pid-match"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setError("");
                  }}
                >
                  <span className="pid-avatar">{initialsFromName(patient.full_name)}</span>
                  <span className="pid-match-copy">
                    <span className="pid-match-name">{patient.full_name}</span>
                    <span className="pid-match-sub">Patient Code: {patient.patient_code}</span>
                  </span>
                  <span className="pid-check" aria-hidden="true">
                    {selectedPatient?.id === patient.id ? "OK" : ""}
                  </span>
                </button>
              ))}

              {query.trim().length >= 2 && results.length === 0 && (
                <p className="pid-hint">No user match yet. Try full name.</p>
              )}

              <div className="pid-actions">
                <button className="pid-btn pid-btn-secondary" type="button" onClick={() => navigate("/visit-type")}>
                  Back
                </button>

                <button className="pid-btn pid-btn-primary" type="button" disabled={!canContinue} onClick={handleContinue}>
                  Continue
                </button>
              </div>

              {error && <p className="pid-hint">{error}</p>}
            </section>

            <section className="pid-right">
              <p className="pid-pin-label">ENTER YOUR ID NUMBER</p>

              <div className="pid-pin-row">
                <div className="pid-pin-box" aria-live="polite">
                  {displayValue || <span className="pid-pin-placeholder">Select a user first to enter ID</span>}
                </div>
                <button
                  className="pid-visibility"
                  type="button"
                  onClick={() => setShowDigits((prev) => !prev)}
                  disabled={enteredDigits.length === 0}
                >
                  {showDigits ? "Hide" : "Show"}
                </button>
              </div>

              <p className="pid-id-guide">
                {selectedPatient ? "Enter ID number then tap Continue" : "Select a user to validate your ID"}
              </p>

              <div className="pid-keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button key={n} className="pid-key" type="button" onClick={() => handleDigit(String(n))}>
                    {n}
                  </button>
                ))}
                <button className="pid-key pid-key-del" type="button" onClick={handleDelete}>
                  DEL
                </button>
                <button className="pid-key" type="button" onClick={() => handleDigit("0")}>
                  0
                </button>
                <button className="pid-key pid-key-clear" type="button" onClick={handleClear}>
                  CLR
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
