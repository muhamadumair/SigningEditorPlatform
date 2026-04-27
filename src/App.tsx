import { ManualSignPage } from "./pages/manual-sign-page";
import "antd/dist/antd.css";
// import { Suspense, useEffect } from "react";
import { useEffect } from "react";
import i18next from "i18next";
import { pdfjs } from 'react-pdf';
// Resolve worker from PUBLIC_URL so it works in both local dev and when
// the app is deployed under a sub-path.
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/editor/pdf.worker.js`;

function MSApp() {
  // Initialised langgauge in EN:
  useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length! >= 2) {
      i18next.changeLanguage("en");
    }
  }, []);

  return (
    // fallback - for translation not loaded for cetain reasons
    // <Suspense fallback={null}>
    <div className="App">
      <ManualSignPage />
    </div>
    // </Suspense>
  );
}

export default MSApp;
