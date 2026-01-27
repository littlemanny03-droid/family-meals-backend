import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ REQUIRED FOR BROWSERS / REQBIN
export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { country } = body;

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a chef assistant. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: `
Give 5 popular meals from ${country}.
Return ONLY JSON like:
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

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI failed" },
      { status: 500 }
    );
  }
}