import { Routes, Route } from "react-router-dom";
import KioskHome from "./pages/KioskHome";
import TermsConditions from "./pages/TermsConditions";
import PatientRegistration from "./pages/PatientRegistration";
import VisitType from "./pages/VisitType";
import PatientIdLookup from "./pages/PatientIdLookup";
import HealthAssessment from "./pages/HealthAssessment";
import MeasurePlaceholder from "./pages/MeasurePlaceholder";
import HealthSummary from "./pages/HealthSummary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<KioskHome />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/visit-type" element={<VisitType />} />
      <Route path="/patient-id" element={<PatientIdLookup />} />
      <Route path="/registration" element={<PatientRegistration />} />
      <Route path="/measure" element={<HealthAssessment />} />
      <Route path="/measure/:id" element={<MeasurePlaceholder />} />
      <Route path="/health-summary" element={<HealthSummary />} />
    </Routes>
  );
}
