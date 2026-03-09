import { useNavigate } from "react-router-dom";

export default function VisitType() {
  const navigate = useNavigate();

  return (
    <div className="vt-root">
      <div className="vt-frame">
        <div className="vt-card">
          <div className="vt-icon" aria-hidden="true">
            <span className="vt-icon-dot" />
          </div>

          <h1 className="vt-title">Have you visited us before?</h1>
          <p className="vt-subtitle">Returning or new user?</p>

          <div className="vt-actions">
            <button
              className="vt-btn vt-btn-primary"
              type="button"
              onClick={() => navigate("/patient-id")}
            >
              <span className="vt-btn-mark" aria-hidden="true">
                Yes
              </span>
              <span className="vt-btn-copy">
                <span className="vt-btn-title">Yes, I have a Patient ID</span>
                <span className="vt-btn-sub">I already have an existing ID</span>
              </span>
            </button>

            <button
              className="vt-btn vt-btn-secondary"
              type="button"
              onClick={() => navigate("/registration")}
            >
              <span className="vt-btn-mark" aria-hidden="true">
                New
              </span>
              <span className="vt-btn-copy">
                <span className="vt-btn-title">No, I&apos;m a new patient</span>
                <span className="vt-btn-sub">Create a new patient record</span>
              </span>
            </button>

            <button
              className="vt-back"
              type="button"
              onClick={() => navigate("/terms")}
            >
              &larr; Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
