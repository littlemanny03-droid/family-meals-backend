import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Health check (GET)
export async function GET() {
  return Response.json({
    status: "API is live 🚀",
    message: "Use POST to get AI meal suggestions",
  });
}

// ✅ Main AI endpoint (POST)
export async function POST(req: Request) {
  try {
    const { country } = await req.json();

    if (!country || typeof country !== "string") {
      return Response.json(
        { error: "Country is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a local food expert. Respond ONLY with valid JSON. No explanations. No markdown.",
        },
        {
          role: "user",
          content: `Return exactly 5 real traditional dishes from ${country} in this format:

[
  { "name": "Dish name" }
]`,
        },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // 🔍 Debug log (temporary but very useful)
    console.log("AI RAW RESPONSE:", raw);

    const meals = JSON.parse(raw);

    return Response.json(meals);
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
