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

// Available channel (raw Slack channel data)
export interface AvailableChannel {
  id: string;
  created: number;
  creator: string;
  is_org_shared: boolean;
  is_im: boolean;
  context_team_id: string;
  updated: number;
  name: string;
  name_normalized: string;
  is_channel: boolean;
  is_group: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;
  is_shared: boolean;
  is_ext_shared: boolean;
  unlinked: number;
  is_pending_ext_shared: boolean;
  pending_shared: any[];
  parent_conversation: any;
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  shared_team_ids: string[];
  pending_connected_team_ids: any[];
  is_member: boolean;
  num_members: number;
  properties?: any;
  previous_names: any[];
}
