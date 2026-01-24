import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const country = body.country;

    if (!country) {
      return Response.json(
        { error: "Missing country" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful chef assistant. Respond ONLY with valid JSON."
        },
        {
          role: "user",
          content: `
Give 5 popular meals from ${country}.
Return ONLY JSON in this format:
[
  { "name": "Meal name", "imagePrompt": "short food description" }
]
          `
        }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content ?? "[]";
    const data = JSON.parse(text);

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
