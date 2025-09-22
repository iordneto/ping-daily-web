import { useAuth } from "@/contexts/AuthContext";
import { useSlackChannels } from "@/hooks/useSlackChannels";
import { UserProfile } from "./UserProfile";
import { ChannelsList } from "./ChannelsList";
import { ErrorDisplay } from "../ui/ErrorDisplay";

/**
 * Main dashboard component for authenticated users showing profile and channels
 * @returns {JSX.Element | null} The Slack dashboard component or null if no user
 */
export function SlackDashboard() {
  const { user, logout } = useAuth();
  const { channels, loading, error, fetchChannels, hasChannels } =
    useSlackChannels();

  if (!user) return null;

  return (
    <>
      <UserProfile user={user} />

      {/* Fetch channels button */}
      <button
        onClick={fetchChannels}
        disabled={loading}
        className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
      >
        {loading ? "Loading..." : "📋 Fetch My Channels"}
      </button>

      {/* Channels list */}
      {hasChannels && <ChannelsList channels={channels} />}

      {/* Error display */}
      {error && <ErrorDisplay error={error} className="mt-4" />}

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors mt-4"
      >
        Logout
      </button>
    </>
  );
}
