/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** The loading message to display */
  message?: string;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Displays a loading message with consistent styling
 * @param {LoadingSpinnerProps} props - The component props
 * @returns {JSX.Element} The loading spinner component
 */
export function LoadingSpinner({
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`text-center text-sm text-gray-600 ${className}`}>
      {message}
    </div>
  );
}
