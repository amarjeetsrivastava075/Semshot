import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const maxDuration = 60;

const TOTAL_BUDGET_MS = 52_000;
const FIRST_ATTEMPT_MS = 30_000;
const NEXT_ATTEMPT_MS = 22_000;
const MIN_ATTEMPT_MS = 6_000;

const DEFAULT_MODELS = ["gemini-3.6-flash", "gemini-3-flash-preview"];

const MST_MARKS = [2, 2, 2, 2, 2, 5, 5];
const END_SEM_MARKS = [2, 5, 2, 5, 2, 5, 5, 5, 2, 2, 5, 10];

type Mode = "practice" | "mst" | "endsem";
type Kind = "mcq" | "descriptive";

type NormalizedQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  answerText: string;
  explanation: string;
  topic: string;
  unit: string;
  difficulty: string;
  marks: number;
};

class GenerationError extends Error {
  retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

function getModels() {
  const fromEnv = (process.env.GEMINI_MODELS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return fromEnv.length ? fromEnv : DEFAULT_MODELS;
}

function resolveMode(value: unknown): Mode {
  const mode = String(value || "").toLowerCase().replace(/[^a-z]/g, "");
  if (mode === "mst") return "mst";
  if (mode === "endsem") return "endsem";
  return "practice";
}

function resolveKind(mode: Mode, questionType: unknown): Kind {
  if (mode !== "practice") return "descriptive";
  return String(questionType || "").toLowerCase() === "descriptive"
    ? "descriptive"
    : "mcq";
}

function buildMarksPlan(mode: Mode, kind: Kind, requested: number) {
  if (mode === "mst") return MST_MARKS;
  if (mode === "endsem") return END_SEM_MARKS;

  const count = Math.min(Math.max(requested, 1), kind === "mcq" ? 30 : 15);
  return Array.from({ length: count }, () => (kind === "mcq" ? 1 : 5));
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end <= start) {
      throw new GenerationError("AI returned an unreadable response.", true);
    }

    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      throw new GenerationError("AI returned malformed JSON.", true);
    }
  }
}

function buildPrompt(input: {
  subjectName: string;
  subjectCode: string;
  units: string[];
  difficulty: string;
  mode: Mode;
  kind: Kind;
  marksPlan: number[];
  examPattern: string;
}) {
  const { marksPlan } = input;
  const count = marksPlan.length;
  const total = marksPlan.reduce((sum, marks) => sum + marks, 0);
  const modeLabel =
    input.mode === "mst"
      ? "MST (Mid Semester Test)"
      : input.mode === "endsem"
        ? "End Semester Examination"
        : "Practice Test";

  const header = `Generate exactly ${count} university-level exam questions.

Subject: ${input.subjectName}
Subject Code: ${input.subjectCode || "N/A"}
Difficulty: ${input.difficulty}
Exam Mode: ${modeLabel}
Total Marks: ${total}

Syllabus units:
${input.units.map((unit, index) => `${index + 1}. ${unit}`).join("\n")}

Exam pattern:
${input.examPattern.trim() || modeLabel}

Rules:
- Follow only the given syllabus and spread questions across the units.
- All questions must be unique.
- Return only valid JSON, no markdown.`;

  if (input.kind === "mcq") {
    return `${header}
- Every question has exactly 4 options and exactly one correct option.
- "answer" is the zero-based index (0 to 3) of the correct option.
- "explanation" is one or two short sentences.

JSON format:
{"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"answer":0,"explanation":"...","topic":"Unit name","difficulty":"Medium","marks":1}]}`;
  }

  return `${header}
- Question i must carry exactly these marks in order: ${marksPlan.join(", ")}.
- Do not include options. "options" must be an empty array and "answer" must be -1.
- "answerText" is the model answer. Keep it proportional to marks: about 2-3 sentences for 2 marks, 5-7 sentences or short points for 5 marks, a structured answer for 10 marks.
- "explanation" is an optional one-line marking hint.

JSON format:
{"questions":[{"id":"q1","question":"...","options":[],"answer":-1,"answerText":"...","explanation":"...","topic":"Unit name","difficulty":"Medium","marks":2}]}`;
}

function normalizeQuestions(
  raw: unknown,
  kind: Kind,
  marksPlan: number[],
  difficulty: string,
  fallbackTopic: string
): NormalizedQuestion[] {
  const list = (raw as { questions?: unknown })?.questions;

  if (!Array.isArray(list) || list.length < marksPlan.length) {
    throw new GenerationError(
      "AI returned fewer questions than required.",
      true
    );
  }

  const seen = new Set<string>();

  return marksPlan.map((marks, index) => {
    const item = (list[index] || {}) as Record<string, unknown>;
    const question = String(item.question || "").trim();

    if (question.length < 8) {
      throw new GenerationError(`Question ${index + 1} is empty.`, true);
    }

    const key = question.toLowerCase();

    if (seen.has(key)) {
      throw new GenerationError("AI returned duplicate questions.", true);
    }

    seen.add(key);

    const topic = String(item.topic || item.unit || fallbackTopic).trim();

    const base = {
      id: `q${index + 1}`,
      question,
      explanation: String(item.explanation || "").trim(),
      topic,
      unit: topic,
      difficulty: String(item.difficulty || difficulty),
      marks,
    };

    if (kind === "mcq") {
      const options = Array.isArray(item.options)
        ? item.options.map((option) => String(option).trim())
        : [];
      const answer = Number(item.answer);

      if (
        options.length !== 4 ||
        options.some((option) => !option) ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer > 3
      ) {
        throw new GenerationError(
          `Question ${index + 1} has invalid options or answer.`,
          true
        );
      }

      return { ...base, options, answer, answerText: options[answer] };
    }

    const answerText = String(item.answerText || item.modelAnswer || "").trim();

    if (!answerText) {
      throw new GenerationError(
        `Question ${index + 1} has no model answer.`,
        true
      );
    }

    return { ...base, options: [], answer: -1, answerText };
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  controller: AbortController
) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      controller.abort();
      reject(new GenerationError("AI took too long to respond.", true));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function classifyError(error: unknown): GenerationError {
  if (error instanceof GenerationError) return error;

  const message = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number })?.status;

  if (
    status === 503 ||
    /503|UNAVAILABLE|high demand|overloaded/i.test(message)
  ) {
    return new GenerationError("The AI service is busy right now.", true);
  }

  if (status === 429 || /429|RESOURCE_EXHAUSTED|quota/i.test(message)) {
    return new GenerationError(
      "AI usage limit reached. Try again shortly.",
      true
    );
  }

  if (status === 404 || /not found|not supported/i.test(message)) {
    return new GenerationError("A configured AI model is not available.", true);
  }

  if (status === 400 || status === 401 || status === 403) {
    return new GenerationError(
      "AI request was rejected. Check the API key and model names.",
      false
    );
  }

  return new GenerationError("AI generation failed.", true);
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "GEMINI_API_KEY is not configured on the server.",
        retryable: false,
      },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body.", retryable: false },
      { status: 400 }
    );
  }

  const subjectName = String(body.subjectName || "").trim();

  if (!subjectName) {
    return NextResponse.json(
      { success: false, error: "Subject name is required.", retryable: false },
      { status: 400 }
    );
  }

  const selected = Array.isArray(body.selectedUnits) ? body.selectedUnits : [];
  const syllabus = Array.isArray(body.syllabus) ? body.syllabus : [];

  const units = (selected.length ? selected : syllabus)
    .map((unit) => String(unit).trim())
    .filter(Boolean)
    .slice(0, 40);

  if (!units.length) {
    return NextResponse.json(
      {
        success: false,
        error: "Select at least one syllabus unit.",
        retryable: false,
      },
      { status: 400 }
    );
  }

  const mode = resolveMode(body.examMode);
  const kind = resolveKind(mode, body.questionType);
  const difficulty = String(body.difficulty || "Medium");
  const marksPlan = buildMarksPlan(
    mode,
    kind,
    Number(body.questionCount) || 10
  );

  const prompt = buildPrompt({
    subjectName,
    subjectCode: String(body.subjectCode || ""),
    units,
    difficulty,
    mode,
    kind,
    marksPlan,
    examPattern: String(body.examPattern || ""),
  });

  const ai = new GoogleGenAI({ apiKey });
  const models = getModels();
  const attempts = [...models, ...models].slice(0, 4);

  let lastError = new GenerationError("AI generation failed.", true);

  for (let index = 0; index < attempts.length; index++) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);

    if (remaining < MIN_ATTEMPT_MS) break;

    const limit = Math.min(
      remaining - 1_000,
      index === 0 ? FIRST_ATTEMPT_MS : NEXT_ATTEMPT_MS
    );

    const model = attempts[index];
    const controller = new AbortController();

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
            maxOutputTokens: kind === "descriptive" ? 7000 : 4096,
            abortSignal: controller.signal,
          },
        }),
        limit,
        controller
      );

      const text = response.text?.trim();

      if (!text) {
        throw new GenerationError("AI returned an empty response.", true);
      }

      const questions = normalizeQuestions(
        extractJson(text),
        kind,
        marksPlan,
        difficulty,
        subjectName
      );

      console.log(
        `generate-questions ok model=${model} ms=${Date.now() - startedAt}`
      );

      return NextResponse.json({
        success: true,
        subject: subjectName,
        examMode: mode,
        questionType: kind === "mcq" ? "MCQ" : "Descriptive",
        totalMarks: marksPlan.reduce((sum, marks) => sum + marks, 0),
        model,
        questions,
      });
    } catch (error) {
      lastError = classifyError(error);
      console.error(
        `generate-questions fail model=${model} attempt=${index + 1}:`,
        error
      );

      if (!lastError.retryable) break;
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: `${lastError.message} Please try again in a moment.`,
      retryable: lastError.retryable,
    },
    { status: 503 }
  );
}