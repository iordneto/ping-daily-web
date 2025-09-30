import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { slackConfig, OAUTH_SCOPES, OAUTH_STORAGE_KEYS } from "@/config/slack";
import { generateRandomString } from "@/utils/generateRandomString";
import { decodeJWT } from "@/utils/decodeJWT";
import { useError } from "./useError";

/**
 * Custom hook for handling Slack OAuth authentication flow
 * @returns {Object} An object containing OAuth functions and error state
 */
export function useSlackOAuth() {
  const { login } = useAuth();
  const { error, handleError, clearError } = useError();

  /**
   * Initiates the Slack OAuth login flow by redirecting to Slack's authorization URL
   * @function
   * @returns {void}
   */
  const initiateLogin = useCallback(() => {
    if (!slackConfig.clientId) {
      handleError(new Error("Please configure the Slack Client ID"));
      return;
    }

    clearError();

    const state = generateRandomString(16);
    const nonce = generateRandomString(16);

    // Save state and nonce in localStorage for later validation
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

  /**
   * Handles the OAuth callback by exchanging authorization code for access token
   * @function
   * @param {string} code - Authorization code received from Slack
   * @param {string} state - State parameter for CSRF protection
   * @returns {Promise<void>}
   */
  const handleCallback = useCallback(
    async (code: string, state: string) => {
      clearError();

      try {
        const savedState = localStorage.getItem(OAUTH_STORAGE_KEYS.STATE);
        if (state !== savedState) {
          throw new Error("Invalid OAuth state");
        }

        // Exchange authorization code for access token
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
          throw new Error("Failed to exchange code for token");
        }

        const tokenData = await tokenResponse.json();

        if (tokenData.id_token && tokenData.access_token) {
          const userData = decodeJWT(tokenData.id_token);

          const savedNonce = localStorage.getItem(OAUTH_STORAGE_KEYS.NONCE);
          if (userData.nonce !== savedNonce) {
            throw new Error("Invalid JWT nonce");
          }

          login({
            userData,
            accessToken: tokenData.access_token,
            idToken: tokenData.id_token,
          });

          // Clear OAuth data from localStorage
          localStorage.removeItem(OAUTH_STORAGE_KEYS.STATE);
          localStorage.removeItem(OAUTH_STORAGE_KEYS.NONCE);

          // Clear URL parameters
          window.history.replaceState({}, document.title, "/");
        }
      } catch (err) {
        handleError(err);
      }
    },
    [login, handleError, clearError]
  );

  /**
   * Effect that handles OAuth callback processing on component mount
   * Checks URL parameters for OAuth response and processes them accordingly
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
    /** Current error message from OAuth operations */
    error,
    /** Function to initiate Slack OAuth login flow */
    initiateLogin,
    /** Function to clear current error state */
    clearError,
  };
}
