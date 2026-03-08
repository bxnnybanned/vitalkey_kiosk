import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MEASUREMENTS } from "../data/measurements";

function parseNumber(input) {
  const n = Number.parseFloat(String(input || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function evaluateStatus(id, value) {
  if (id === "bp") {
    const [sysRaw, diaRaw] = String(value || "").split("/");
    const systolic = parseNumber(sysRaw);
    const diastolic = parseNumber(diaRaw);
    if (systolic == null || diastolic == null) return { label: "Unclear", tone: "warn" };
    if (systolic >= 140 || diastolic >= 90) return { label: "High", tone: "warn" };
    if (systolic >= 120 || diastolic >= 80) return { label: "Elevated", tone: "warn" };
    return { label: "Normal", tone: "ok" };
  }

  const n = parseNumber(value);
  if (n == null) return { label: "Recorded", tone: "ok" };

  if (id === "temp") {
    if (n < 36 || n > 37.5) return { label: "Needs Review", tone: "warn" };
    return { label: "Normal", tone: "ok" };
  }
  if (id === "oxygen") {
    if (n < 95) return { label: "Low Oxygen", tone: "warn" };
    return { label: "Normal", tone: "ok" };
  }
  if (id === "bmi") {
    if (n >= 30) return { label: "Obese", tone: "warn" };
    if (n >= 25) return { label: "Overweight", tone: "warn" };
    if (n < 18.5) return { label: "Underweight", tone: "warn" };
    return { label: "Normal", tone: "ok" };
  }
  return { label: "Recorded", tone: "ok" };
}

function formatValue(id, raw, unit) {
  if (id === "bp") return String(raw || "120/80");
  if (!raw) return "--";
  if (id === "oxygen") return `${parseNumber(raw) ?? raw}%`;
  if (id === "bmi") return `${parseNumber(raw) ?? raw}`;
  return `${raw} ${unit}`;
}

export default function HealthSummary() {
  const navigate = useNavigate();
  const done = JSON.parse(localStorage.getItem("vk_measurement_done") || "{}");
  const values = JSON.parse(localStorage.getItem("vk_measurement_values") || "{}");
  const returning = JSON.parse(localStorage.getItem("vk_returning_patient") || "null");
  const fresh = JSON.parse(localStorage.getItem("vk_patient") || "null");
  const patientName = returning?.full_name || fresh?.fullName || "Guest";

  const summaryItems = useMemo(() => {
    return MEASUREMENTS.filter((m) => done[m.id]).map((m) => {
      const value = values[m.id] || m.placeholder;
      const status = evaluateStatus(m.id, value);
      return {
        ...m,
        valueText: formatValue(m.id, value, m.unit),
        status,
      };
    });
  }, [done, values]);

  const risk = summaryItems.some((item) => item.status.tone === "warn")
    ? { title: "Moderate Risk", msg: "Consult physician recommended", tone: "warn" }
    : { title: "Stable Readings", msg: "No urgent flags detected", tone: "ok" };

  function handleFinish() {
    localStorage.removeItem("vk_measurement_done");
    localStorage.removeItem("vk_measurement_values");
    navigate("/");
  }

  return (
    <div className="hs-root">
      <div className="hs-shell">
        <header className="hs-header">
          <div>
            <h1>Health Summary Report</h1>
            <p>{new Date().toLocaleString()}</p>
          </div>
          <span>{patientName}</span>
        </header>

        <section className={`hs-risk ${risk.tone === "warn" ? "is-warn" : "is-ok"}`}>
          <strong>{risk.title}</strong>
          <p>{risk.msg}</p>
        </section>

        {summaryItems.length ? (
          <section className="hs-grid">
            {summaryItems.map((item) => (
              <article key={item.id} className="hs-card">
                <p className="hs-card-label">{item.shortTitle}</p>
                <h3 className="hs-card-value">{item.valueText}</h3>
                <span className={`hs-badge ${item.status.tone === "warn" ? "is-warn" : "is-ok"}`}>
                  {item.status.label}
                </span>
              </article>
            ))}
          </section>
        ) : (
          <section className="hs-empty">
            <p>No completed measurements yet. Go back and complete at least one measurement.</p>
          </section>
        )}

        <footer className="hs-actions">
          <button type="button" className="hs-btn hs-btn--ghost" onClick={() => navigate("/measure")}>
            Back to Assessment
          </button>
          <button type="button" className="hs-btn hs-btn--primary" onClick={handleFinish}>
            Finish
          </button>
        </footer>
      </div>
    </div>
  );
}

