import { useState, useCallback } from "react";

/**
 * Custom hook for managing error state and error handling operations
 * @returns {Object} An object containing error state and error management functions
 */
export function useError() {
  const [error, setError] = useState<string>("");

  /**
   * Clears the current error state
   * @function
   * @returns {void}
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  /**
   * Handles an error by extracting its message and setting the error state
   * @function
   * @param {unknown} err - The error to handle, can be of any type
   * @returns {void}
   */
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    setError(message);
  }, []);

  return {
    /** Current error message string */
    error,
    /** Function to manually set error state */
    setError,
    /** Function to clear the current error */
    clearError,
    /** Function to handle and process errors */
    handleError,
    /** Boolean indicating if there is an active error */
    hasError: !!error,
  };
}
