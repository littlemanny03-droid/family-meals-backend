export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    console.log(
      "🔑 KEY PREFIX:",
      process.env.OPENAI_API_KEY?.slice(0, 7)
    );

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
          content:
            "Return ONLY raw JSON. No markdown. No backticks. No explanations.",
        },
        {
          role: "user",
          content: `
Country: ${country}

Return exactly 5 dishes in this format:
[
  { "name": "Dish name" }
]
`,
        },
      ],
      temperature: 0.7,
    });

    // ✅ FIX STARTS HERE
    const raw = completion.choices[0].message.content ?? "";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let meals;
    try {
      meals = JSON.parse(cleaned);
    } catch {
      console.error("❌ JSON PARSE FAILED:", cleaned);
      return Response.json(
        { error: "Invalid JSON from AI", raw: cleaned },
        { status: 500 }
      );
    }
    // ✅ FIX ENDS HERE

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
