import { NextRequest, NextResponse } from "next/server";

/**
 * Fetches Slack channels that the authenticated user is a member of
 * @param {NextRequest} request - The incoming request with Authorization header
 * @returns {Promise<NextResponse>} Response containing user's channels data
 */
export async function GET(request: NextRequest) {
  try {
    // Extract access_token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.split(" ")[1];

    // Fetch public and private channels from Slack API
    const channelsResponse = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel,private_channel&exclude_archived=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!channelsResponse.ok) {
      throw new Error("Failed to fetch channels");
    }

    const channelsData = await channelsResponse.json();

    if (!channelsData.ok) {
      return NextResponse.json(
        { error: channelsData.error || "Slack API error" },
        { status: 400 }
      );
    }

    // Filter only channels where the user is a member
    const userChannels = channelsData.channels.filter(
      (channel: any) => channel.is_member
    );

    return NextResponse.json({
      channels: userChannels.map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        num_members: channel.num_members,
        topic: channel.topic?.value || "",
        purpose: channel.purpose?.value || "",
      })),
    });
  } catch (error) {
    console.error("Channels API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
