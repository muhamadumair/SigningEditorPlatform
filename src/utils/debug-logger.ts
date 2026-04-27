/**
 * Debug Logger Utility
 * 
 * This utility controls ALL console.log output based on the REACT_APP_DEBUG_MODE environment variable.
 * 
 * - npm run build:debug → All console.log statements work normally
 * - npm run build → All console.log statements are suppressed
 * 
 * How it works:
 * When REACT_APP_DEBUG_MODE is NOT 'true', this file overrides console.log globally
 * to become a no-op function, effectively disabling all console.log calls.
 */

// Check if debug mode is enabled (trim to handle whitespace)
const envValue = process.env.REACT_APP_DEBUG_MODE;
const isDebugMode = envValue?.trim() === 'true';

/**
 * Conditional console.log that only outputs when debug mode is enabled
 * @param args - Arguments to pass to console.log
 */
export const debugLog = (...args: any[]) => {
  if (isDebugMode) {
    console.log(...args);
  }
};

/**
 * Check if debug mode is currently enabled
 * @returns true if debug mode is enabled, false otherwise
 */
export const isDebugEnabled = (): boolean => {
  return isDebugMode;
};

/**
 * Override console.log globally when debug mode is OFF
 * This disables console.log statements except for specific allowed ones
 */
if (!isDebugMode) {
  // Store the original console.log
  const originalLog = console.log;
  
  // Override console.log to filter out debug messages
  console.log = (...args: any[]) => {
    // Convert first argument to string for checking
    const firstArg = String(args[0] || '');
    
    // Allow specific console.logs to pass through
    const isAllowedLog = 
      firstArg.includes('window.__INITIAL_STATE__') ||
      firstArg.includes('onClickReactLibraryApply') ||
      firstArg.includes('Listening to the event') ||
      firstArg.includes('submit_sign_coordinate__event');
    
    // Only log if it's an allowed message
    if (isAllowedLog) {
      originalLog(...args);
    }
    // Otherwise suppress (do nothing)
  };
  
  // Keep console.error and console.warn working
  // (they are not affected)
}
