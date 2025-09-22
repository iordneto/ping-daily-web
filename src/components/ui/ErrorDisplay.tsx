/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** The error message to display */
  error: string;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Displays error messages with consistent styling
 * @param {ErrorDisplayProps} props - The component props
 * @returns {JSX.Element | null} The error display component or null if no error
 */
export function ErrorDisplay({ error, className = "" }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div
      className={`p-3 bg-red-100 border border-red-400 text-red-700 rounded ${className}`}
    >
      {error}
    </div>
  );
}
