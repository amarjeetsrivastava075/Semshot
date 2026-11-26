import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is missing" },
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
        { success: false, error: "Subject name is required" },
        { status: 400 }
      );
    }

    const units =
      Array.isArray(selectedUnits) && selectedUnits.length
        ? selectedUnits
        : Array.isArray(syllabus)
          ? syllabus
          : [];

    const count = Math.min(
      Math.max(Number(questionCount) || 7, 1),
      15
    );

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Generate exactly ${count} university-level exam questions.

Subject: ${subjectName}
Subject Code: ${subjectCode || "N/A"}
Difficulty: ${difficulty || "Medium"}
Question Type: ${questionType || "Descriptive"}
Exam Pattern: ${examPattern || "University examination"}

Syllabus:
${units.length ? units.join("\n") : subjectName}

Rules:
- Questions must strictly follow the syllabus.
- Avoid duplicate questions.
- Use clear university-level language.
- For MCQs, provide exactly 4 options.
- For descriptive questions, provide an empty options array.
- Answer must be a zero-based index for MCQs.
- For descriptive questions, answer must be -1.
- Include a useful explanation or answer guideline.
- Return valid JSON only.

Required JSON:
{
  "success": true,
  "subject": "${subjectName}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": [],
      "answer": -1,
      "explanation": "Answer guideline",
      "unit": "Unit name",
      "difficulty": "Medium"
    }
  ]
}
`;

    console.log("Starting Gemini generation:", subjectName);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("Gemini returned an empty response");
    }

    const exam = JSON.parse(responseText);

    if (!Array.isArray(exam.questions) || !exam.questions.length) {
      throw new Error("Invalid questions returned by Gemini");
    }

    const questions = exam.questions.slice(0, count).map(
      (question: any, index: number) => ({
        id: question.id || `q${index + 1}`,
        question: String(question.question || ""),
        options: Array.isArray(question.options) ? question.options : [],
        answer: Number(question.answer ?? -1),
        explanation: String(question.explanation || ""),
        unit: String(question.unit || "General"),
        difficulty: question.difficulty || difficulty || "Medium",
      })
    );

    console.log("Generation completed in:", Date.now() - startTime, "ms");

    return NextResponse.json({
      success: true,
      subject: exam.subject || subjectName,
      questions,
    });
  } catch (error: any) {
    console.error("EXAM GENERATION ERROR:", error);

    const message =
      error?.message || "Failed to generate examination";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}