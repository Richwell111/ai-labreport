import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. General chat will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        { error: "Question is too long" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a medical information assistant.

PURPOSE:
- Provide general, educational health information.
- Help users understand medical concepts in simple language.

STRICT RULES:
- Do NOT diagnose conditions.
- Do NOT provide treatment plans or prescriptions.
- Do NOT give personalized medical advice.
- Use general, educational explanations only.
- Be calm, neutral, and reassuring.
- If a question requires personal medical judgment, say so and recommend consulting a healthcare professional.

FORMAT:
- Plain text only
- Short paragraphs
- Simple bullet points where helpful
- No markdown formatting

USER QUESTION:
${question}

Now provide a safe, clear, informational answer.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("General chat error:", error.message);
    } else {
      console.error("General chat error: Unknown error", error);
    }
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details:
          error instanceof Error ? error.message : "Unknown generation error",
      },
      { status: 500 }
    );
  }
}
