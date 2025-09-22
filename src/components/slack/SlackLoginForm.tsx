import { useAuth } from "@/contexts/AuthContext";
import { useSlackOAuth } from "@/hooks/useSlackOAuth";
import { SlackLoginButton } from "./SlackLoginButton";
import { ErrorDisplay } from "../ui/ErrorDisplay";
import { LoadingSpinner } from "../ui/LoadingSpinner";

/**
 * Complete Slack login form component with login button, loading states, and error handling
 * @returns {JSX.Element} The Slack login form component
 */
export function SlackLoginForm() {
  const { isLoading } = useAuth();
  const { error, initiateLogin } = useSlackOAuth();

  return (
    <>
      <SlackLoginButton onLogin={initiateLogin} disabled={isLoading} />

      {isLoading && <LoadingSpinner message="Processing..." className="mt-4" />}

      {error && <ErrorDisplay error={error} className="mt-4" />}
    </>
  );
}
