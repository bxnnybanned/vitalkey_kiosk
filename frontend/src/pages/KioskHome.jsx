import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return useMemo(() => {
    const weekday = now.toLocaleDateString(undefined, { weekday: "short" });
    const month = now.toLocaleDateString(undefined, { month: "short" });
    const day = now.getDate();
    const year = now.getFullYear();

    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr12 = hours % 12 || 12;

    return {
      dayLabel: `${weekday}, ${month} ${pad2(day)}, ${year}`,
      timeLabel: `${hr12}:${pad2(mins)} ${ampm}`,
    };
  }, [now]);
}

export default function KioskHome() {
  const { dayLabel, timeLabel } = useClock();
  const navigate = useNavigate();

  return (
    <div className="vk-root">
      <div className="vk-frame">
        <div className="vk-card" role="application" aria-label="VitalKey Kiosk">
          {/* LEFT */}
          <section className="vk-left">
            <div className="vk-badge" aria-hidden="true">
              <span className="vk-badge-dot" />
            </div>

            <div className="vk-titleblock">
              <h1 className="vk-title">VITALKEY</h1>
              <h2 className="vk-title vk-title--bold">KIOSK</h2>

              <p className="vk-subtitle">HEALTH MONITORING STATION</p>

              <div className="vk-meta">
                <span>{dayLabel}</span>
                <span className="vk-meta-sep">•</span>
                <span>{timeLabel}</span>
              </div>
            </div>

            <div className="vk-line" aria-hidden="true" />
          </section>

          {/* RIGHT */}
          <section className="vk-right">
            <div className="vk-right-top">
              <p className="vk-hint">TAP TO BEGIN</p>

              <button
                className="vk-start"
                type="button"
                onClick={() => navigate("/language")}
              >
                <span className="vk-start-icon" aria-hidden="true">
                  ▶
                </span>
                <span>START</span>
              </button>
            </div>

            <div className="vk-right-bottom">
              <div
                className="vk-status"
                role="status"
                aria-label="System Online"
              >
                <span className="vk-status-dot" aria-hidden="true" />
                <span className="vk-status-text">System Online</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
