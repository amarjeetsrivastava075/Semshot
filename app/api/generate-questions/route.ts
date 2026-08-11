import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      subjectName,
      subjectCode,
      syllabus,
      selectedUnits,
      questionCount,
      difficulty,
      questionType,
      examPattern,
    } = body;

    if (!subjectName) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject name is required",
        },
        { status: 400 }
      );
    }

    const units =
      Array.isArray(selectedUnits) && selectedUnits.length > 0
        ? selectedUnits
        : Array.isArray(syllabus)
          ? syllabus
          : [];

    const ai = new GoogleGenAI({
      apiKey,
    });

    const count = Number(questionCount) || 10;

    const prompt = `
You are an expert university examination paper generator for an AI exam preparation platform called SemShot.

Generate a high-quality exam for the following subject.

Subject: ${subjectName}
Subject Code: ${subjectCode || "Not provided"}

Syllabus:
${
  units.length > 0
    ? units.map((unit: string, index: number) => `${index + 1}. ${unit}`).join("\n")
    : "Use the subject name and generate questions from standard university-level topics."
}

Question Count: ${count}
Difficulty: ${difficulty || "Medium"}
Question Type: ${questionType || "MCQ"}

Exam Pattern:
${examPattern || "General university examination pattern"}

IMPORTANT RULES:

1. Generate exactly ${count} questions.
2. Questions must be academically accurate.
3. Avoid duplicate questions.
4. Cover different syllabus topics where possible.
5. Every MCQ must have exactly 4 options.
6. Only one option must be correct.
7. The answer must be the zero-based option index.
8. Include a clear explanation.
9. Return ONLY valid JSON.
10. Do not use markdown.
11. Do not use triple backticks.
12. Do not add any text before or after the JSON.

Return exactly this structure:

{
  "success": true,
  "subject": "${subjectName}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,
      "explanation": "Explanation of the correct answer",
      "unit": "Unit/topic name",
      "difficulty": "${difficulty || "Medium"}"
    }
  ]
}
`;

    console.log("Generating exam for:", subjectName);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";

    console.log("Gemini response received:", text.slice(0, 300));

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!cleaned) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned an empty response",
        },
        { status: 500 }
      );
    }

    let exam;

    try {
      exam = JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start === -1 || end === -1) {
        return NextResponse.json(
          {
            success: false,
            error: "Gemini returned invalid JSON",
            raw: cleaned.slice(0, 1000),
          },
          { status: 500 }
        );
      }

      try {
        exam = JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Could not parse Gemini response as JSON",
            raw: cleaned.slice(0, 1000),
          },
          { status: 500 }
        );
      }
    }

    if (!exam || !Array.isArray(exam.questions)) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini response does not contain valid questions",
          raw: cleaned.slice(0, 1000),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subject: exam.subject || subjectName,
      questions: exam.questions,
    });
  } catch (error) {
    console.error("GENERATE EXAM ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate exam",
      },
      { status: 500 }
    );
  }
}