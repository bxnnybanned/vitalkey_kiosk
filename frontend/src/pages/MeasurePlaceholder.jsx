import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MeasurementIcon from "../components/MeasurementIcon";
import { getMeasurementById } from "../data/measurements";

const STEP_CONFIG = {
  default: {
    title: "Measurement Ready",
    subtitle: "Infrared scan active. No contact required.",
    scanLine: "Scanning... please hold still.",
    readingLabel: "Current Reading",
    statusLabel: "Normal range detected",
    steps: [
      "Position yourself in front of the kiosk sensor.",
      "Aim your forehead at the sensor and stay centered.",
      "Hold still for 3 seconds.",
    ],
  },
  bp: {
    title: "Blood Pressure Measurement",
    subtitle: "Automated arm cuff. Takes around 60 seconds.",
    scanLine: "Cuff inflating... Do not move.",
    readingLabel: "Blood Pressure",
    statusLabel: "Elevated",
    steps: [
      "Insert left arm through the BP cuff opening on the kiosk.",
      "Position your cuff 2 cm above the elbow with palm facing up.",
      "Sit still and relax. Do not talk or move while cuff inflates.",
    ],
  },
  height: {
    title: "Height Measurement",
    subtitle: "Ultrasonic height sensor. Instant reading.",
    scanLine: "Detecting height...",
    readingLabel: "Height Detected",
    statusLabel: "Reading Captured",
    steps: [
      "Step onto the marked platform area at the base of the kiosk.",
      "Remove shoes or slippers for an accurate reading.",
      "Stand straight and look forward at eye level.",
    ],
  },
  weight: {
    title: "Weight Measurement",
    subtitle: "Digital load cell platform. Accuracy: 0.1 kg.",
    scanLine: "Measuring weight...",
    readingLabel: "Weight Detected",
    statusLabel: "Reading Stable",
    steps: [
      "Stay on the platform after completing height measurement.",
      "Distribute weight evenly with feet shoulder-width apart.",
      "Hold still for 3 seconds while scale auto-captures.",
    ],
  },
  bmi: {
    title: "BMI Calculation",
    subtitle: "Calculated from height and weight. No additional steps needed.",
    scanLine: "BMI formula processed from captured values.",
    readingLabel: "Your BMI",
    statusLabel: "Overweight Category",
    steps: [
      "Use latest height and weight values from this session.",
      "Compute BMI using weight divided by height squared.",
      "Review the BMI category and continue to oxygen check.",
    ],
  },
  oxygen: {
    title: "SpO2 Measurement",
    subtitle: "Pulse oximetry sensor. Takes around 15 seconds.",
    scanLine: "Reading oxygen saturation...",
    readingLabel: "SpO2 - Oxygen Saturation",
    statusLabel: "Normal (95-100%)",
    steps: [
      "Locate the blue pulse oximeter slot on the kiosk right panel.",
      "Insert your right index finger fully into the sensor slot.",
      "Hold still for 15 seconds and breathe normally.",
    ],
  },
};

export default function MeasurePlaceholder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = getMeasurementById(id);
  const [showSteps, setShowSteps] = useState(false);
  const [reading, setReading] = useState("");
  const cfg = STEP_CONFIG[item?.id] || STEP_CONFIG.default;
  const isBp = item?.id === "bp";
  const isHeight = item?.id === "height";
  const isWeight = item?.id === "weight";
  const isBmi = item?.id === "bmi";
  const isOxygen = item?.id === "oxygen";

  if (!item) {
    return (
      <div className="ms-root">
        <div className="ms-shell">
          <p className="ms-empty">Measurement not found.</p>
          <button type="button" className="ms-btn ms-btn--primary" onClick={() => navigate("/measure")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  function saveAndBack() {
    const done = JSON.parse(localStorage.getItem("vk_measurement_done") || "{}");
    const values = JSON.parse(localStorage.getItem("vk_measurement_values") || "{}");
    done[item.id] = true;
    values[item.id] = reading.trim() || item.placeholder;
    localStorage.setItem("vk_measurement_done", JSON.stringify(done));
    localStorage.setItem("vk_measurement_values", JSON.stringify(values));
    navigate("/measure");
  }

  function handleRescan() {
    const done = JSON.parse(localStorage.getItem("vk_measurement_done") || "{}");
    const values = JSON.parse(localStorage.getItem("vk_measurement_values") || "{}");
    delete done[item.id];
    delete values[item.id];
    localStorage.setItem("vk_measurement_done", JSON.stringify(done));
    localStorage.setItem("vk_measurement_values", JSON.stringify(values));
    setReading("");
  }

  const displayReading = reading.trim() || item.placeholder;
  const bpParts = displayReading.split("/");
  const heightValue = displayReading.replace(/[^0-9.]/g, "") || "162";
  const weightValue = displayReading.replace(/[^0-9.]/g, "") || "74.2";
  const bmiValue = displayReading.replace(/[^0-9.]/g, "") || "28.3";
  const oxygenValue = displayReading.replace(/[^0-9.]/g, "") || "98";

  return (
    <div className="ms-root">
      <div className={`ms-shell ${isBp ? "is-bp" : ""} ${isHeight ? "is-height" : ""} ${isWeight ? "is-weight" : ""} ${isBmi ? "is-bmi" : ""} ${isOxygen ? "is-oxygen" : ""}`}>
        <header className={`ms-topbar ${isBp ? "is-bp" : ""} ${isHeight ? "is-height" : ""} ${isWeight ? "is-weight" : ""} ${isBmi ? "is-bmi" : ""} ${isOxygen ? "is-oxygen" : ""}`}>
          <button type="button" className="ms-back" onClick={() => navigate("/measure")} aria-label="Back">
            &lsaquo;
          </button>
          <h1>{item.title}</h1>
          <span className="ms-topbar-spacer" aria-hidden="true" />
        </header>

        <main className="ms-body">
          <section className="ms-left">
            <div className={`ms-icon-wrap ${item.tone}`} aria-hidden="true">
              <MeasurementIcon id={item.id} />
            </div>
            <div>
              <h2>{cfg.title}</h2>
              <p>{cfg.subtitle}</p>
            </div>
            <button type="button" className="ms-btn ms-btn--ghost" onClick={() => setShowSteps(true)}>
              View Steps
            </button>
          </section>

          <section className={`ms-reading ${isBp ? "is-bp" : ""} ${isHeight ? "is-height" : ""} ${isWeight ? "is-weight" : ""} ${isBmi ? "is-bmi" : ""} ${isOxygen ? "is-oxygen" : ""}`}>
            <div className={`ms-live-step ${isBp ? "is-bp" : ""} ${isHeight ? "is-height" : ""} ${isWeight ? "is-weight" : ""} ${isBmi ? "is-bmi" : ""} ${isOxygen ? "is-oxygen" : ""}`} aria-live="polite">
              <p>{cfg.scanLine}</p>
            </div>
            {isBmi ? (
              <div className="ms-bmi-formula">
                <p className="ms-reading-label">BMI Formula</p>
                <strong>BMI = Weight (kg) / Height² (m)</strong>
                <small>74.2 ÷ (1.62 × 1.62) = 28.3</small>
              </div>
            ) : null}
            {isBmi ? (
              <div className="ms-bmi-scale">
                <p className="ms-reading-label">BMI Scale</p>
                <div className="ms-bmi-scale-bar" />
                <div className="ms-bmi-scale-labels">
                  <div className="u">
                    <strong>Underweight</strong>
                    <span>&lt;18.5</span>
                  </div>
                  <div className="n">
                    <strong>Normal</strong>
                    <span>18.5-24.9</span>
                  </div>
                  <div className="o">
                    <strong>Overweight</strong>
                    <span>25-29.9</span>
                  </div>
                  <div className="ob">
                    <strong>Obese</strong>
                    <span>&gt;30</span>
                  </div>
                </div>
              </div>
            ) : null}
            <p className="ms-reading-label">{cfg.readingLabel}</p>
            <div className={`ms-reading-value ${isBmi ? "is-bmi" : ""}`}>
              {isBp ? (
                <div className="ms-bp-display">
                  <strong>{bpParts[0] || "138"}</strong>
                  <em>/{bpParts[1] || "92"}</em>
                </div>
              ) : isHeight ? (
                <div className="ms-height-display">
                  <strong>{heightValue}</strong>
                  <em>cm</em>
                </div>
              ) : isWeight ? (
                <div className="ms-weight-display">
                  <strong>{weightValue}</strong>
                  <em>kg</em>
                </div>
              ) : isBmi ? (
                <div className="ms-bmi-display">
                  <strong>{bmiValue}</strong>
                </div>
              ) : isOxygen ? (
                <div className="ms-oxygen-display">
                  <strong>{oxygenValue}</strong>
                  <em>%</em>
                </div>
              ) : (
                <input
                  type="text"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder={item.placeholder}
                />
              )}
              <span>{isBp ? "mmHg - Systolic / Diastolic" : isHeight ? "centimeters" : isWeight ? "kilograms" : isBmi ? "body mass index" : isOxygen ? "oxygen saturation percent" : item.unit}</span>
            </div>
            <p className={`ms-range ${isBp ? "is-bp" : ""} ${isHeight ? "is-height" : ""} ${isWeight ? "is-weight" : ""} ${isBmi ? "is-bmi" : ""} ${isOxygen ? "is-oxygen" : ""}`}>{cfg.statusLabel}</p>
            <div className="ms-actions">
              <button type="button" className="ms-btn ms-btn--ghost" onClick={() => navigate("/measure")}>
                Later
              </button>
              <button type="button" className="ms-btn ms-btn--rescan" onClick={handleRescan}>
                Rescan
              </button>
              <button type="button" className="ms-btn ms-btn--primary" onClick={saveAndBack}>
                Save
              </button>
            </div>
          </section>
        </main>
      </div>

      {showSteps ? (
        <div className="ms-modal-backdrop" role="presentation" onClick={() => setShowSteps(false)}>
          <div className="ms-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Measurement Steps</h3>
            <div className="ms-step-list">
              {cfg.steps.map((step, idx) => (
                <div key={step} className="ms-step">
                  <span>{idx + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <button type="button" className="ms-btn ms-btn--primary" onClick={() => setShowSteps(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
