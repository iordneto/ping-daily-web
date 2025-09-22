import { useState, useCallback } from "react";

export function useError() {
  const [error, setError] = useState<string>("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    setError(message);
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
    hasError: !!error,
  };
}
