import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
          content:
            "You are a food expert. Respond ONLY with valid JSON.",
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
    const meals = JSON.parse(text);

    return Response.json({ meals });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}

export function GET() {
  return Response.json({
    status: "API is live 🚀",
    message: "Use POST to get AI meal suggestions",
  });
}