export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import OpenAI from "openai";

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

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Professional food photography of ${prompt}`,
      size: "1024x1024",
    });

    const imageUrl = image.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("Image generation failed");
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