import { useAuth } from "@/contexts/AuthContext";
import { useSlackOAuth } from "@/hooks/useSlackOAuth";
import { SlackLoginButton } from "./SlackLoginButton";
import { ErrorDisplay } from "../ui/ErrorDisplay";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function SlackLoginForm() {
  const { isLoading } = useAuth();
  const { error, initiateLogin } = useSlackOAuth();

  return (
    <>
      <SlackLoginButton onLogin={initiateLogin} disabled={isLoading} />

      {isLoading && (
        <LoadingSpinner message="Processando..." className="mt-4" />
      )}

      {error && <ErrorDisplay error={error} className="mt-4" />}
    </>
  );
}
