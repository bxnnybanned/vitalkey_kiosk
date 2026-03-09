import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MeasurementIcon from "../components/MeasurementIcon";
import { MEASUREMENTS } from "../data/measurements";

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

export default function HealthAssessment() {
  const navigate = useNavigate();
  const timeLabel = useTimeLabel();
  const returning = JSON.parse(localStorage.getItem("vk_returning_patient") || "null");
  const fresh = JSON.parse(localStorage.getItem("vk_patient") || "null");
  const done = JSON.parse(localStorage.getItem("vk_measurement_done") || "{}");
  const displayName = returning?.full_name || fresh?.fullName || "Guest";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((v) => v[0]?.toUpperCase() || "")
    .join("");

  const doneCount = Object.values(done).filter(Boolean).length;
  const progressLabel = doneCount ? `${doneCount} completed` : "No measurements yet";

  return (
    <div className="ha-root">
      <div className="ha-frame">
        <div className="ha-card-shell">
          <header className="ha-topbar">
            <div className="ha-user">
              <span className="ha-avatar">{initials || "U"}</span>
              <span className="ha-name">{displayName}</span>
            </div>
            <span className="ha-time">{timeLabel}</span>
          </header>

          <main className="ha-body">
            <h1 className="ha-title">Health Assessment</h1>
            <p className="ha-subtitle">Tap a card to open the measurement screen.</p>

            <section className="ha-grid">
              {MEASUREMENTS.map((item) => {
                const isDone = Boolean(done[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ha-card ${item.tone} ${isDone ? "is-done" : ""}`}
                    onClick={() => navigate(`/measure/${item.id}`)}
                  >
                    <span className="ha-icon" aria-hidden="true">
                      <MeasurementIcon id={item.id} />
                    </span>
                    <span className="ha-label">{item.shortTitle}</span>
                    <span className="ha-pill">{isDone ? "Done" : "Start"}</span>
                  </button>
                );
              })}
            </section>

            <div className="ha-footer">
              <span className="ha-progress">{progressLabel}</span>
              <button className="ha-continue" type="button" onClick={() => navigate("/health-summary")}>
                Continue
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
