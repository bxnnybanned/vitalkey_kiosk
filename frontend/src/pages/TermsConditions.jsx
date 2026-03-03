import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TermsConditions() {
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeBiometric, setAgreeBiometric] = useState(false);

  const canContinue = agreeTerms && agreeBiometric;

  return (
    <div className="tc-root">
      <div className="tc-frame">
        <div className="tc-card">
          {/* Top Bar */}
          <header className="tc-topbar">
            <span className="tc-title">Terms & Conditions</span>
          </header>

          {/* Body */}
          <div className="tc-body">
            {/* LEFT PANEL */}
            <section className="tc-left">
              <h2 className="tc-left-heading">Please Read Carefully</h2>

              <p className="tc-left-sub">
                Scroll to read the full terms before agreeing.
              </p>

              <label className="tc-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>

              <label className="tc-checkbox">
                <input
                  type="checkbox"
                  checked={agreeBiometric}
                  onChange={() => setAgreeBiometric(!agreeBiometric)}
                />
                <span>I consent to biometric data collection</span>
              </label>

              <button
                className="tc-continue"
                disabled={!canContinue}
                onClick={() => navigate("/registration")}
              >
                I Agree & Continue ✓
              </button>
            </section>

            {/* RIGHT PANEL */}
            <section className="tc-right">
              <div className="tc-scroll">
                <h3>1. Data Collection & Privacy</h3>
                <p>
                  VitalKey Kiosk collects biometric health data including
                  temperature, blood pressure, height, weight, BMI, and oxygen
                  saturation. Data is stored securely.
                </p>

                <h3>2. Consent</h3>
                <p>
                  By proceeding, you consent to collection and processing of
                  your health data for authorized purposes.
                </p>

                <h3>3. Purpose of Use</h3>
                <p>
                  Records may be accessed by authorized personnel and will not
                  be shared without consent.
                </p>

                <h3>4. Accuracy Disclaimer</h3>
                <p>
                  Results are for screening purposes only and do not replace
                  professional medical consultation.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
