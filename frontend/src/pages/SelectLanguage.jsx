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

const LANGS = [
  { code: "en", country: "US", name: "English", sub: "United States" },
  { code: "fil", country: "PH", name: "Filipino", sub: "Tagalog (Filipino)" },
];

export default function SelectLanguage() {
  const time = useTimeLabel();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");

  function handleContinue() {
    // optional: remember choice for next pages
    localStorage.setItem("vk_language", selected);

    // change this route anytime:
    // navigate("/consent") or navigate("/next")
    navigate("/terms");
  }

  return (
    <div className="sl-root">
      <div className="sl-frame">
        <div className="sl-card">
          {/* Top bar */}
          <header className="sl-topbar">
            <div className="sl-brand">
              <span className="sl-brand-dot" aria-hidden="true" />
              <span className="sl-brand-text">VITALKEY KIOSK</span>
            </div>

            <div className="sl-time" aria-label="Current time">
              {time}
            </div>
          </header>

          {/* Body */}
          <main className="sl-body">
            {/* Left */}
            <section className="sl-left">
              <div className="sl-icon" aria-hidden="true">
                🌐
              </div>
              <div className="sl-left-text">
                <h1 className="sl-title">Select Language</h1>
                <p className="sl-subtitle">Pili ng wika</p>
              </div>
            </section>

            {/* Divider */}
            <div className="sl-divider" aria-hidden="true" />

            {/* Right */}
            <section className="sl-right">
              <div
                className="sl-options"
                role="radiogroup"
                aria-label="Language options"
              >
                {LANGS.map((l) => {
                  const active = selected === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      className={`sl-option ${active ? "is-active" : ""}`}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelected(l.code)}
                    >
                      <div className="sl-flag">{l.country}</div>

                      <div className="sl-option-text">
                        <div className="sl-option-title">{l.name}</div>
                        <div className="sl-option-sub">{l.sub}</div>
                      </div>

                      <div className="sl-check" aria-hidden="true">
                        {active ? "✓" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                className="sl-continue"
                type="button"
                onClick={handleContinue}
              >
                Continue <span aria-hidden="true">→</span>
              </button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
