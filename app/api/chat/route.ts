import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku", // or gpt-3.5-turbo, mistral-medium, etc.
        messages: [
          {
            role: "system",
            content:
              "You are Superman from DC Comics. Stay fully in character at all times. Never say you're an AI, chatbot, or assistant. You are a heroic protector of humanity. Respond with calm, powerful, hopeful messages like Superman would."
,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenRouter error:", errorText);
      return NextResponse.json({ reply: "⚠️ Error contacting Superman AI." }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "I stand for truth and justice.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Superman API crash:", error);
    return NextResponse.json({ reply: "⚠️ Superman's signal is jammed." }, { status: 500 });
  }
}
