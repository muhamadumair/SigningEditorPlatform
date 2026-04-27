import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      // translation file path
      //loadPath: `/editor/assets/i18n/{{ns}}/{{lng}}.json`, // for local test environment
      loadPath: `./signingcloud-editor/editor/assets/i18n/{{ns}}/{{lng}}.json`,
    },
    fallbackLng: "en",
    // should be disabled in production
    // debug: true,
    // divide into multiple namespaces based on page
    // load them on demand
    ns: ["common", "manual-sign"],

    // interpolation: {
    // espaceValue: false,
    // formatSeperator: ",",
    // },
    // react: {
    //     wait: true
    // },
  });

export default i18n;
