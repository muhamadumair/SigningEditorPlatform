/**
 * Toggles all `console.log` output based on REACT_APP_DEBUG_MODE.
 * Use `debugLog(...)` for new logs; existing `console.log` calls are silenced
 * in non-debug builds except for a small allowlist that the embedding host page
 * still needs (see ALLOWED_LOG_PREFIXES).
 */

const isDebugMode = process.env.REACT_APP_DEBUG_MODE?.trim() === "true";

const ALLOWED_LOG_PREFIXES = [
  "window.__INITIAL_STATE__",
  "onClickReactLibraryApply",
  "Listening to the event",
  "submit_sign_coordinate__event",
];

export const debugLog = (...args: any[]) => {
  if (isDebugMode) console.log(...args);
};

export const isDebugEnabled = () => isDebugMode;

if (!isDebugMode) {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const firstArg = String(args[0] ?? "");
    if (ALLOWED_LOG_PREFIXES.some((p) => firstArg.includes(p))) {
      originalLog(...args);
    }
  };
}
