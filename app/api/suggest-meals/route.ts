import { NextResponse } from "next/server";

// GET — browser test
export function GET() {
  return NextResponse.json({
    status: "API is live 🚀",
    message: "Use POST to get AI meal suggestions",
  });
}

// POST — placeholder (AI comes next)
export async function POST(req: Request) {
  const body = await req.json();
  const { country } = body;

  if (!country) {
    return NextResponse.json(
      { error: "Country is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    meals: [
      { name: `Sample dish from ${country}` },
      { name: `Another popular meal from ${country}` },
    ],
  });
}
