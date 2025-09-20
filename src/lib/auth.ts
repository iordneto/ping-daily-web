/**
 * Next-Auth configuration with custom Slack provider
 */

import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Custom provider for Slack OAuth
const SlackProvider = {
  id: "slack",
  name: "Slack",
  type: "oauth" as const,
  version: "2.0",
  authorization: {
    url: "https://slack.com/oauth/v2/authorize",
    params: {
      scope:
        "users:read users:read.email channels:read groups:read im:read mpim:read",
      response_type: "code",
    },
  },
  token: "https://slack.com/api/oauth.v2.access",
  userinfo: {
    url: "https://slack.com/api/users.identity",
    async request({ tokens }: { tokens: { access_token?: string } }) {
      if (!tokens.access_token) {
        throw new Error("No access token available");
      }

      // Primeiro, vamos obter o user ID usando auth.test
      const authResponse = await fetch("https://slack.com/api/auth.test", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const authData = await authResponse.json();

      if (!authData.ok) {
        throw new Error(`Slack auth.test error: ${authData.error}`);
      }

      // Agora buscar as informações completas do usuário
      const userResponse = await fetch(
        `https://slack.com/api/users.info?user=${authData.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const userData = await userResponse.json();

      if (!userData.ok) {
        throw new Error(`Slack users.info error: ${userData.error}`);
      }

      return {
        ...userData.user,
        team_id: authData.team_id,
        team: {
          id: authData.team_id,
          name: authData.team,
        },
      };
    },
  },
  profile(profile: any, tokens: any) {
    return {
      id: profile.id,
      name: profile.profile?.display_name || profile.real_name || profile.name,
      email: profile.profile?.email,
      image: profile.profile?.image_192,
      teamId: profile.team_id || tokens.team?.id,
      teamName: tokens.team?.name,
      accessToken: tokens.access_token,
      isAdmin: false, // Will be determined by backend
    };
  },
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
};

export const authOptions: NextAuthOptions = {
  providers: [SlackProvider as any],
  pages: {
    signIn: "/", // Use our custom landing page
    error: "/auth/error",
  },
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account?: any;
      user?: any;
    }) {
      // First sign in
      if (account && user) {
        // Para agora, não vamos tentar autenticar com o backend no callback
        // A verificação de admin será feita posteriormente quando necessário

        return {
          ...token,
          accessToken: account.access_token,
          teamId: user.teamId,
          teamName: user.teamName,
          isAdmin: false, // Será determinado depois
          backendToken: undefined,
        } as JWT;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          teamId: token.teamId,
          teamName: token.teamName,
          isAdmin: token.isAdmin,
        },
        accessToken: token.accessToken,
        backendToken: token.backendToken,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Types for our extended session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      teamId?: string;
      teamName?: string;
      isAdmin?: boolean;
    };
    accessToken?: string;
    backendToken?: string;
  }

  interface User {
    teamId?: string;
    teamName?: string;
    accessToken?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    teamId?: string;
    teamName?: string;
    isAdmin?: boolean;
    backendToken?: string;
  }
}
