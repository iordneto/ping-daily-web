import { NextRequest, NextResponse } from "next/server";

/**
 * Exchanges OAuth authorization code for access tokens using Slack's OpenID Connect endpoint
 * @param {NextRequest} request - The incoming request containing OAuth code and credentials
 * @returns {Promise<NextResponse>} Response containing access token and user data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, client_id, client_secret, redirect_uri } = body;

    // Validate required parameters
    if (!code || !client_id || !client_secret || !redirect_uri) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Exchange code for token using Slack's OpenID Connect endpoint
    const tokenResponse = await fetch(
      "https://slack.com/api/openid.connect.token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          code,
          client_id,
          client_secret,
          redirect_uri,
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Slack token exchange failed:", errorText);
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    // Check for errors in Slack API response
    if (!tokenData.ok) {
      console.error("Slack API error:", tokenData);
      return NextResponse.json(
        { error: tokenData.error || "Slack API error" },
        { status: 400 }
      );
    }

    // Return only necessary data to frontend
    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      id_token: tokenData.id_token,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
