export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  num_members: number;
  topic: string;
  purpose: string;
}

export interface SlackUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  nonce?: string;
  "https://slack.com/team_id": string;
  "https://slack.com/user_id": string;
}

export interface SlackConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
