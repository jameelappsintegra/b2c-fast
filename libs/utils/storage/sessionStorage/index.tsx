/**
 * Store session data based on key
 * @param key
 * @param value value to be stored
 */
const storeSessionData = (key: string, value: any) => {
  sessionStorage?.setItem(key, value);
};

/**
 * Get session data based on key
 * @param key
 */
const getSessionData = (key: string) => (sessionStorage ? sessionStorage?.getItem(key) : null);

/**
 * Clear all session data
 */
const clearAllSessionData = () => {
  sessionStorage?.clear();
};

/**
 * Clear session data based on key
 * @param key
 */
const clearSessionData = (key: string) => {
  sessionStorage?.removeItem(key);
};

export { storeSessionData, getSessionData, clearAllSessionData, clearSessionData };
