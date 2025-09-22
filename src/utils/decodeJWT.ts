import { SlackUser } from "@/types";

/* 
    This function decodes a JWT token and returns the payload.
    It is used to decode the id_token from the Slack OAuth flow.
*/
export const decodeJWT = (token: string): SlackUser => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token JWT inválido");
  }

  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decoded);
};
