"use client";

import { useState, useEffect } from "react";

interface SlackUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  nonce?: string;
  "https://slack.com/team_id": string;
  "https://slack.com/user_id": string;
}

interface SlackConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export default function Home() {
  const [config, setConfig] = useState<SlackConfig>({
    clientId: "9359153662263.9375043160484",
    clientSecret: "d70f0f91f2909e63817b319d217d2690",
    redirectUri: "https://r6edzk-ip-186-222-20-25.tunnelmole.net",
  });
  const [user, setUser] = useState<SlackUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Processar callback do OAuth quando a página carrega
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      setError(`OAuth Error: ${error}`);
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  // Gerar nonce e state para segurança
  const generateRandomString = (length: number) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Iniciar o fluxo de login
  const initiateSlackLogin = () => {
    if (!config.clientId) {
      setError("Por favor, configure o Client ID do Slack");
      return;
    }

    const state = generateRandomString(16);
    const nonce = generateRandomString(16);

    // Salvar state e nonce no localStorage para validação posterior
    localStorage.setItem("slack_oauth_state", state);
    localStorage.setItem("slack_oauth_nonce", nonce);

    const params = new URLSearchParams({
      response_type: "code",
      scope: "openid profile email",
      client_id: config.clientId,
      state: state,
      nonce: nonce,
      redirect_uri: config.redirectUri,
    });

    const authUrl = `https://slack.com/openid/connect/authorize?${params.toString()}`;
    window.location.href = authUrl;
  };

  // Processar callback e trocar código por token
  const handleOAuthCallback = async (code: string, state: string) => {
    setLoading(true);
    setError("");

    try {
      // Validar state
      const savedState = localStorage.getItem("slack_oauth_state");
      if (state !== savedState) {
        throw new Error("Estado OAuth inválido");
      }

      // Trocar código por token
      const tokenResponse = await fetch("/api/slack/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Falha ao trocar código por token");
      }

      const tokenData = await tokenResponse.json();

      // Decodificar JWT id_token
      if (tokenData.id_token) {
        const userData = decodeJWT(tokenData.id_token);

        // Validar nonce
        const savedNonce = localStorage.getItem("slack_oauth_nonce");
        if (userData.nonce !== savedNonce) {
          throw new Error("Nonce JWT inválido");
        }

        setUser(userData);

        // Limpar localStorage
        localStorage.removeItem("slack_oauth_state");
        localStorage.removeItem("slack_oauth_nonce");

        // Limpar URL
        window.history.replaceState({}, document.title, "/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Decodificar JWT simples (apenas para demonstração)
  const decodeJWT = (token: string): SlackUser => {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Token JWT inválido");
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setError("");
    localStorage.removeItem("slack_oauth_state");
    localStorage.removeItem("slack_oauth_nonce");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in with Slack
        </h1>

        {!user ? (
          <>
            {/* Configuração do Slack App */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Configuração da App
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={config.clientId}
                    onChange={(e) =>
                      setConfig({ ...config, clientId: e.target.value })
                    }
                    placeholder="Seu Client ID do Slack"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={config.clientSecret}
                    onChange={(e) =>
                      setConfig({ ...config, clientSecret: e.target.value })
                    }
                    placeholder="Seu Client Secret do Slack"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Redirect URI
                  </label>
                  <input
                    type="text"
                    value={config.redirectUri}
                    onChange={(e) =>
                      setConfig({ ...config, redirectUri: e.target.value })
                    }
                    placeholder="http://localhost:3000/"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botão Sign in with Slack */}
            <button
              onClick={initiateSlackLogin}
              disabled={loading || !config.clientId}
              className="w-full bg-white text-black border border-gray-300 rounded-md py-3 px-4 font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523c0-1.395 1.125-2.528 2.52-2.528h2.52v2.528c0 1.395-1.125 2.523-2.52 2.523zM6.313 15.165c0-1.395 1.125-2.523 2.52-2.523s2.52 1.128 2.52 2.523v6.312c0 1.395-1.125 2.523-2.52 2.523s-2.52-1.128-2.52-2.523v-6.312zM8.833 5.042a2.528 2.528 0 0 1-2.52-2.52c0-1.395 1.125-2.522 2.52-2.522s2.52 1.127 2.52 2.522v2.52H8.833zM8.833 6.313c1.395 0 2.52 1.125 2.52 2.52s-1.125 2.52-2.52 2.52H2.522c-1.395 0-2.522-1.125-2.522-2.52s1.127-2.52 2.522-2.52h6.311zM18.958 8.833c1.395 0 2.523 1.125 2.523 2.52s-1.128 2.52-2.523 2.52h-2.52V8.833h2.52zM17.687 8.833c0 1.395-1.125 2.52-2.52 2.52s-2.52-1.125-2.52-2.52V2.522c0-1.395 1.125-2.522 2.52-2.522s2.52 1.127 2.52 2.522v6.311zM15.167 18.958c1.395 0 2.523 1.128 2.523 2.523S16.562 24 15.167 24s-2.52-1.119-2.52-2.519v-2.523h2.52zM15.167 17.687c-1.395 0-2.52-1.125-2.52-2.52s1.125-2.52 2.52-2.52h6.311c1.395 0 2.523 1.125 2.523 2.52s-1.128 2.52-2.523 2.52h-6.311z"
                  fill="#E01E5A"
                />
              </svg>
              Sign in with Slack
            </button>

            {loading && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Processando...
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Instruções */}
            <div className="mt-6 text-xs text-gray-500">
              <p>
                <strong>Para configurar:</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Acesse{" "}
                  <a
                    href="https://api.slack.com/apps"
                    className="text-blue-600 underline"
                  >
                    api.slack.com/apps
                  </a>
                </li>
                <li>Crie uma nova app ou selecione uma existente</li>
                <li>Vá em "OAuth & Permissions"</li>
                <li>Adicione o Redirect URL: {config.redirectUri}</li>
                <li>Copie o Client ID e Client Secret</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            {/* Usuário logado */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="#666"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Bem-vindo!</h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Nome:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User ID:</span>
                <span className="font-mono text-sm">
                  {user["https://slack.com/user_id"]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Team ID:</span>
                <span className="font-mono text-sm">
                  {user["https://slack.com/team_id"]}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
