import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    // ✅ SAFE GUARD (this fixes your error)
    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      return Response.json(
        { error: "Image generation returned no data" },
        { status: 500 }
      );
    }

    return Response.json({ imageUrl });

  } catch (error: any) {
    console.error("IMAGE ERROR:", error);

    return Response.json(
      {
        error: "Image generation failed",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}