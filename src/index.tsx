import ReactDOM from "react-dom/client";
import MSApp from "./App";
// uncomment for measurement of the perfomance of app:
// import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import "./i18n";
// Import debug logger to initialize console.log override
import "./utils/debug-logger";

const root = ReactDOM.createRoot(document.getElementById("editor-root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <MSApp />
  </Provider>
  // </React.StrictMode>
);

export * as MSApp from "./App";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
