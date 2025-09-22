import { SlackUser } from "@/types/slack";

/**
 * Decodes a JWT token and extracts the payload containing user information
 * Used specifically for decoding id_tokens from Slack's OAuth flow
 * @param {string} token - The JWT token to decode (format: header.payload.signature)
 * @returns {SlackUser} The decoded user data from the token payload
 * @throws {Error} When the token format is invalid
 * @example
 * const userData = decodeJWT(idToken);
 * console.log(userData.name); // User's name
 */
export const decodeJWT = (token: string): SlackUser => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decoded);
};
