import { NextRequest, NextResponse } from "next/server";
import { analyzeLabReportText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing 'text' field in request body" },
        { status: 400 }
      );
    }

    const analysis = await analyzeLabReportText(text);

    return NextResponse.json({ success: true, analysis });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Gemini analysis error:", error.message);
    } else {
      console.error("Gemini analysis error: Unknown error", error);
    }
    return NextResponse.json(
      {
        error: "Failed to analyze lab report",
        details:
          error instanceof Error ? error.message : "Unknown analysis error",
      },
      { status: 500 }
    );
  }
}
