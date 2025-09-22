import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, client_id, client_secret, redirect_uri } = body;

    // Validar parâmetros obrigatórios
    if (!code || !client_id || !client_secret || !redirect_uri) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Trocar código por token usando o endpoint OpenID Connect do Slack
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
        { error: "Falha na troca do código por token" },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    // Verificar se houve erro na resposta do Slack
    if (!tokenData.ok) {
      console.error("Slack API error:", tokenData);
      return NextResponse.json(
        { error: tokenData.error || "Erro na API do Slack" },
        { status: 400 }
      );
    }

    // Retornar apenas os dados necessários para o frontend
    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      id_token: tokenData.id_token,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
