import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { slackConfig, OAUTH_SCOPES, OAUTH_STORAGE_KEYS } from "@/config/slack";
import { generateRandomString } from "@/utils/generateRandomString";
import { decodeJWT } from "@/utils/decodeJWT";
import { useError } from "./useError";

export function useSlackOAuth() {
  const { login } = useAuth();
  const { error, handleError, clearError } = useError();

  /* 
    This function initiates the Slack OAuth login flow.
  */
  const initiateLogin = useCallback(() => {
    if (!slackConfig.clientId) {
      handleError(new Error("Please configure the Slack Client ID"));
      return;
    }

    clearError();

    const state = generateRandomString(16);
    const nonce = generateRandomString(16);

    /* 
      Save the state and nonce in localStorage for validation later.
    */
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

  /* 
    This function handles the OAuth callback.
  */
  const handleCallback = useCallback(
    async (code: string, state: string) => {
      clearError();

      try {
        const savedState = localStorage.getItem(OAUTH_STORAGE_KEYS.STATE);
        if (state !== savedState) {
          throw new Error("Estado OAuth inválido");
        }

        /* 
          Exchange the code for a token.
        */
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

        if (tokenData.id_token && tokenData.access_token) {
          const userData = decodeJWT(tokenData.id_token);

          const savedNonce = localStorage.getItem(OAUTH_STORAGE_KEYS.NONCE);
          if (userData.nonce !== savedNonce) {
            throw new Error("Nonce JWT inválido");
          }

          login(userData, tokenData.access_token);

          /* 
            Clear the localStorage.
          */
          localStorage.removeItem(OAUTH_STORAGE_KEYS.STATE);
          localStorage.removeItem(OAUTH_STORAGE_KEYS.NONCE);

          /* 
            Clear the URL.
          */
          window.history.replaceState({}, document.title, "/");
        }
      } catch (err) {
        handleError(err);
      }
    },
    [login, handleError, clearError]
  );

  /* 
    This effect handles the OAuth callback when the page is loaded.
  */
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
