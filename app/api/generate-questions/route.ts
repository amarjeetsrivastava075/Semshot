import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is missing in Vercel environment variables." },
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
      examMode,
    } = body;

    if (!subjectName) {
      return NextResponse.json(
        { success: false, error: "Subject name is required." },
        { status: 400 }
      );
    }

    const units =
      Array.isArray(selectedUnits) && selectedUnits.length
        ? selectedUnits
        : Array.isArray(syllabus)
          ? syllabus
          : [];

    if (!units.length) {
      return NextResponse.json(
        { success: false, error: "Please select at least one syllabus unit." },
        { status: 400 }
      );
    }

    const mode = String(examMode || "practice").toLowerCase();

    const isMST = mode === "mst";
    const isEndSem = mode === "endsem" || mode === "end_sem";
    const isDescriptive = isMST || isEndSem;

    const count = isMST
      ? 7
      : Math.min(Math.max(Number(questionCount) || 10, 5), 50);

    const marksInstruction = isMST
      ? "Questions 1-5 must carry 2 marks each. Questions 6-7 must carry 5 marks each. Total marks: 20."
      : isEndSem
        ? "Generate descriptive university examination questions with suitable marks according to the provided exam pattern."
        : "Generate multiple-choice questions with exactly four options and one correct answer.";

    const outputFormat = isDescriptive
      ? `
{
  "success": true,
  "subject": "${subjectName}",
  "questions": [
    {
      "id": "q1",
      "question": "Descriptive question text",
      "options": [],
      "answerText": "Expected answer or key points",
      "explanation": "Answer explanation",
      "unit": "Unit name",
      "difficulty": "medium",
      "marks": 2
    }
  ]
}`
      : `
{
  "success": true,
  "subject": "${subjectName}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Correct answer explanation",
      "unit": "Unit name",
      "difficulty": "medium",
      "marks": 1
    }
  ]
}`;

    const prompt = `
You are SemShot, an expert university examination paper generator.

Generate exactly ${count} questions.

SUBJECT DETAILS
Subject: ${subjectName}
Subject Code: ${subjectCode || "Not provided"}

SELECTED SYLLABUS:
${units.map((unit: string, index: number) => `${index + 1}. ${unit}`).join("\n")}

EXAM MODE: ${isMST ? "MST" : isEndSem ? "END SEMESTER" : "PRACTICE"}
DIFFICULTY: ${difficulty || "medium"}
QUESTION TYPE: ${isDescriptive ? "Descriptive" : questionType || "MCQ"}

EXAM PATTERN:
${examPattern || "Standard university examination pattern"}

IMPORTANT INSTRUCTIONS:

1. Generate exactly ${count} questions.
2. Every question must be based on the selected syllabus.
3. Do not generate duplicate questions.
4. Maintain university examination quality.
5. Cover different selected units.
6. ${marksInstruction}
7. ${isDescriptive
        ? "Do not generate MCQ options. Keep options as an empty array. Include answerText and marks for every question."
        : "Every question must have exactly 4 options. The answer must be a zero-based index from 0 to 3."
      }
8. Include a relevant unit and difficulty.
9. Return only valid JSON.
10. Do not include markdown or additional text.

REQUIRED JSON STRUCTURE:
${outputFormat}
`;

    const ai = new GoogleGenAI({ apiKey });

    let responseText = "";
    let lastError: unknown;

    const models = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

for (const model of models) {
  try {
    console.log("Trying model:", model);

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    responseText = response.text || "";

    if (responseText.trim()) {
      console.log("Generated using:", model);
      break;
    }

    throw new Error("Empty Gemini response");
  } catch (error: any) {
    lastError = error;

    const message = String(error?.message || error).toLowerCase();

    console.error(`${model} failed:`, message);

    const retryable =
      message.includes("503") ||
      message.includes("429") ||
      message.includes("unavailable") ||
      message.includes("high demand") ||
      message.includes("overloaded") ||
      message.includes("resource exhausted");

    if (!retryable) break;
  }
}

    if (!responseText.trim()) {
      const message =
        lastError instanceof Error
          ? lastError.message
          : "Gemini could not generate the exam.";

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 503 }
      );
    }

    let exam;

    try {
      exam = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned invalid JSON. Please try again.",
        },
        { status: 502 }
      );
    }

    if (!Array.isArray(exam?.questions) || exam.questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid questions were generated.",
        },
        { status: 502 }
      );
    }

    const questions = exam.questions.map((question: any, index: number) => ({
      id: String(question.id || `q${index + 1}`),
      question: String(question.question || ""),
      options: isDescriptive
        ? []
        : Array.isArray(question.options)
          ? question.options.map((option: any) => String(option))
          : [],
      answer: isDescriptive ? undefined : Number(question.answer),
      answerText: String(question.answerText || ""),
      explanation: String(question.explanation || ""),
      unit: String(question.unit || ""),
      difficulty: String(question.difficulty || difficulty || "medium"),
      marks: Number(
        question.marks || (isMST ? (index < 5 ? 2 : 5) : 1)
      ),
    }));

    const validQuestions = questions.filter((question: any) => {
      if (!question.question) return false;

      if (isDescriptive) return true;

      return (
        question.options.length === 4 &&
        Number.isInteger(question.answer) &&
        question.answer >= 0 &&
        question.answer <= 3
      );
    });

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Generated questions were invalid. Please retry." },
        { status: 502 }
      );
    }

    if (isMST && validQuestions.length < 7) {
      return NextResponse.json(
        { success: false, error: "MST requires exactly 7 descriptive questions. Please retry." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      subject: exam.subject || subjectName,
      questions: isMST ? validQuestions.slice(0, 7) : validQuestions,
    });
  } catch (error) {
    console.error("GENERATE EXAM ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate exam.",
      },
      { status: 500 }
    );
  }
}