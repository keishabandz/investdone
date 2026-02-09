import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY =
  process.env.OPEN_AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null;

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const symbol =
      typeof body?.symbol === "string" ? body.symbol.toUpperCase() : "";
    const scores = body?.scores ?? null;

    if (!symbol || !scores) {
      return NextResponse.json(
        { error: "symbol and scores are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an investing learning coach. Give a concise educational summary for ${symbol} using these scores:
${JSON.stringify(scores)}
Return JSON with keys: headline, summary, nextStep.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You produce safe educational insights." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", details: errorText },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const raw = payload?.choices?.[0]?.message?.content;
    const parsed =
      typeof raw === "string"
        ? JSON.parse(raw)
        : { headline: "AI Insight", summary: "No insight available.", nextStep: "" };

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate insight",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
