import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { slackConfig, OAUTH_SCOPES, OAUTH_STORAGE_KEYS } from "@/config/slack";
import { generateRandomString } from "@/utils/generateRandomString";
import { decodeJWT } from "@/utils/decodeJWT";
import { useError } from "./useError";

export function useSlackOAuth() {
  const { login } = useAuth();
  const { error, handleError, clearError } = useError();

  // Iniciar fluxo de login
  const initiateLogin = useCallback(() => {
    if (!slackConfig.clientId) {
      handleError(new Error("Por favor, configure o Client ID do Slack"));
      return;
    }

    clearError();

    const state = generateRandomString(16);
    const nonce = generateRandomString(16);

    // Salvar state e nonce no localStorage para validação posterior
    localStorage.setItem(OAUTH_STORAGE_KEYS.STATE, state);
    localStorage.setItem(OAUTH_STORAGE_KEYS.NONCE, nonce);

    const params = new URLSearchParams({
      response_type: "code",
      scope: OAUTH_SCOPES,
      client_id: slackConfig.clientId,
      state,
      nonce,
      redirect_uri: slackConfig.redirectUri,
    });

    const authUrl = `https://slack.com/openid/connect/authorize?${params.toString()}`;
    window.location.href = authUrl;
  }, [handleError, clearError, login]);

  // Processar callback OAuth
  const handleCallback = useCallback(
    async (code: string, state: string) => {
      clearError();

      try {
        // Validar state
        const savedState = localStorage.getItem(OAUTH_STORAGE_KEYS.STATE);
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
            client_id: slackConfig.clientId,
            client_secret: slackConfig.clientSecret,
            redirect_uri: slackConfig.redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error("Falha ao trocar código por token");
        }

        const tokenData = await tokenResponse.json();

        // Decodificar JWT id_token
        if (tokenData.id_token && tokenData.access_token) {
          const userData = decodeJWT(tokenData.id_token);

          // Validar nonce
          const savedNonce = localStorage.getItem(OAUTH_STORAGE_KEYS.NONCE);
          if (userData.nonce !== savedNonce) {
            throw new Error("Nonce JWT inválido");
          }

          login(userData, tokenData.access_token);

          // Limpar localStorage
          localStorage.removeItem(OAUTH_STORAGE_KEYS.STATE);
          localStorage.removeItem(OAUTH_STORAGE_KEYS.NONCE);

          // Limpar URL
          window.history.replaceState({}, document.title, "/");
        }
      } catch (err) {
        handleError(err);
      }
    },
    [login, handleError, clearError]
  );

  // Processar callback na inicialização
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const urlError = urlParams.get("error");

    if (urlError) {
      handleError(new Error(`OAuth Error: ${urlError}`));
      return;
    }

    if (code && state) {
      handleCallback(code, state);
    }
  }, [handleCallback, handleError]);

  return {
    error,
    initiateLogin,
    clearError,
  };
}
