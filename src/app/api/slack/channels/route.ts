import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Pegar access_token do header Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de acesso não encontrado" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.split(" ")[1];

    // 🔍 Buscar canais públicos que o usuário está
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
      throw new Error("Falha ao buscar canais");
    }

    const channelsData = await channelsResponse.json();

    if (!channelsData.ok) {
      return NextResponse.json(
        { error: channelsData.error || "Erro na API do Slack" },
        { status: 400 }
      );
    }

    // 🔍 Filtrar apenas canais que o usuário é membro
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
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
