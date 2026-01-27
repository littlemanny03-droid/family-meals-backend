import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ GET handler (browser test)
export function GET() {
  return NextResponse.json({
    status: "API is live 🚀",
    message: "Use POST to get AI meal suggestions",
  });
}

// ✅ POST handler (real AI)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { country } = body;

    if (!country) {
      return NextResponse.json(
        { error: "Missing country" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful chef assistant. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: `
Give 5 popular meals from ${country}.
Return ONLY JSON in this format:
[
  { "name": "Meal name", "imagePrompt": "short food description" }
]
          `,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content ?? "[]";
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}