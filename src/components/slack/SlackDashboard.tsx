import { useAuth } from "@/contexts/AuthContext";
import { useSlackChannels } from "@/hooks/useSlackChannels";
import { UserProfile } from "./UserProfile";
import { ChannelsList } from "./ChannelsList";
import { ErrorDisplay } from "../ui/ErrorDisplay";

export function SlackDashboard() {
  const { user, logout } = useAuth();
  const { channels, loading, error, fetchChannels, hasChannels } =
    useSlackChannels();

  if (!user) return null;

  return (
    <>
      <UserProfile user={user} />

      {/* Botão buscar canais */}
      <button
        onClick={fetchChannels}
        disabled={loading}
        className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
      >
        {loading ? "Carregando..." : "📋 Buscar Meus Canais"}
      </button>

      {/* Lista de canais */}
      {hasChannels && <ChannelsList channels={channels} />}

      {/* Erro */}
      {error && <ErrorDisplay error={error} className="mt-4" />}

      {/* Botão logout */}
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors mt-4"
      >
        Logout
      </button>
    </>
  );
}
