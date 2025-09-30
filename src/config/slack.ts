import { SlackConfig } from "@/types/slack";

/**
 * Slack OAuth configuration object containing client credentials and redirect URI
 * @type {SlackConfig}
 */
export const slackConfig: SlackConfig = {
  clientId: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
};

/**
 * OAuth scopes required for Slack authentication and API access
 * @constant {string}
 */
export const OAUTH_SCOPES = "openid profile email";

/**
 * LocalStorage keys used for OAuth state management
 * @constant {Object}
 */
export const OAUTH_STORAGE_KEYS = {
  STATE: "slack_oauth_state",
  NONCE: "slack_oauth_nonce",
} as const;
