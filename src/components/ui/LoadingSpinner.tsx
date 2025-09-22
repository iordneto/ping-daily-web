interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Carregando...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`text-center text-sm text-gray-600 ${className}`}>
      {message}
    </div>
  );
}
