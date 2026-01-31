export const runtime = "nodejs";

console.log("🔥 NODE RUNTIME ROUTE LOADED 🔥");

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return Response.json({
    status: "API is live 🚀",
    message: "Use POST to get AI meal suggestions",
  });
}

export async function POST(req: Request) {
  try {
    const { country } = await req.json();

    if (!country) {
      return Response.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a local food expert.
Return ONLY valid JSON.
Suggest 5 real traditional dishes.
No explanations.
`,
        },
        {
          role: "user",
          content: `Country: ${country}`,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content ?? "[]";
    const meals = JSON.parse(text);

    return Response.json({ meals });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return Response.json(
      {
        error: "AI request failed",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}