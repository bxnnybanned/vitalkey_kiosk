import { Routes, Route } from "react-router-dom";
import KioskHome from "./pages/KioskHome";
import SelectLanguage from "./pages/SelectLanguage";
import TermsConditions from "./pages/TermsConditions";
import PatientRegistration from "./pages/PatientRegistration";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<KioskHome />} />
      <Route path="/language" element={<SelectLanguage />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/registration" element={<PatientRegistration />} />
    </Routes>
  );
}
