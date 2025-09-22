/* 
    This type is used to store the user data from the Slack OAuth flow.
*/
interface SlackUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  nonce?: string;
  "https://slack.com/team_id": string;
  "https://slack.com/user_id": string;
}

/* 
    This type is used to store the configuration for the Slack OAuth flow.
*/
interface SlackConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export type { SlackUser, SlackConfig };
