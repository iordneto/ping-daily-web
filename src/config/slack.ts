import { SlackConfig } from "@/types";

export const slackConfig: SlackConfig = {
  clientId: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
};

export const OAUTH_SCOPES =
  "openid profile email channels:read groups:read mpim:read";

export const OAUTH_STORAGE_KEYS = {
  STATE: "slack_oauth_state",
  NONCE: "slack_oauth_nonce",
} as const;
