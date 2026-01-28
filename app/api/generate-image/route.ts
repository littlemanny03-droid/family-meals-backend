import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x512",
    });

    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image returned from AI" },
        { status: 500 }
      );
    }

  } catch (error: any) {
  console.error("IMAGE ERROR:", error?.message || error);

  return NextResponse.json(
    {
      error: "Image generation failed",
      details: error?.message ?? "Unknown error"
    },
    { status: 500 }
  );
 }
}