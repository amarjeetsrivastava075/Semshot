import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const maxDuration = 60;

const TOTAL_BUDGET_MS = 54000;
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

  constructor(message: string, retryable = true) {
    super(message);
    this.retryable = retryable;
  }
}

function getModels() {
  return [
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash"
  ];
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

  const count = Math.min(
    Math.max(requested || 10, 1),
    kind === "mcq" ? 30 : 15
  );

  return Array.from(
    { length: count },
    () => (kind === "mcq" ? 1 : 5)
  );
}

function extractJson(text: string): any {
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
      throw new GenerationError("AI returned incomplete JSON.");
    }

    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      throw new GenerationError("AI returned invalid JSON.");
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
  const count = input.marksPlan.length;
  const total = input.marksPlan.reduce((sum, marks) => sum + marks, 0);

  const modeLabel =
    input.mode === "mst"
      ? "Mid Semester Test"
      : input.mode === "endsem"
        ? "End Semester Examination"
        : "Practice Test";

  const header = `
You are an expert university examination paper setter for SemShot.

SUBJECT: ${input.subjectName}
SUBJECT CODE: ${input.subjectCode || "N/A"}
DIFFICULTY: ${input.difficulty}
EXAM MODE: ${modeLabel}
TOTAL QUESTIONS: ${count}
TOTAL MARKS: ${total}

SYLLABUS:
${input.units.map((unit, index) => `${index + 1}. ${unit}`).join("\n")}

EXAM PATTERN:
${input.examPattern || modeLabel}

STRICT RULES:
1. Generate exactly ${count} questions.
2. Every question must be unique.
3. Follow the given syllabus only.
4. Do not skip any question.
5. Return complete valid JSON only.
`;

  if (input.kind === "mcq") {
    return `${header}

MCQ RULES:
1. Every question must have exactly 4 options.
2. Only one option must be correct.
3. Answer must be a zero-based index from 0 to 3.
4. Include a short explanation.
5. Avoid ambiguous questions.

JSON:
{"questions":[{"id":"q1","question":"Question","options":["A","B","C","D"],"answer":0,"explanation":"Explanation","topic":"Unit 1","difficulty":"Medium","marks":1}]}`;
  }

  return `${header}

DESCRIPTIVE QUESTION RULES:
1. Generate exactly ${count} descriptive questions.
2. Marks must follow this exact sequence: ${input.marksPlan.join(", ")}.
3. Do not change the marks.
4. Do not include MCQ options.
5. Set options to [] and answer to -1.
6. Every question must have a complete model answer.
7. For 2 marks, answer in 2-3 sentences.
8. For 5 marks, answer in 4-6 concise points or sentences.
9. For 10 marks, provide a structured answer with headings.
10. Do not generate excessively long answers.

JSON:
{"questions":[{"id":"q1","question":"Question","options":[],"answer":-1,"answerText":"Complete model answer","explanation":"Marking hint","topic":"Unit 1","difficulty":"Medium","marks":2}]}`;
}

function buildContinuationPrompt(
  subjectName: string,
  units: string[],
  kind: Kind,
  missingMarks: number[],
  existingQuestions: string[]
) {
  const count = missingMarks.length;

  return `
You are continuing an incomplete university examination paper.

Subject: ${subjectName}

Syllabus:
${units.join("\n")}

Already generated questions:
${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Generate exactly ${count} NEW questions.

Rules:
- Do not repeat existing questions.
- Follow the given syllabus.
- Return exactly ${count} questions.
- Return valid JSON only.

${
  kind === "descriptive"
    ? `
Descriptive rules:
- Marks in exact order: ${missingMarks.join(", ")}.
- options must be [].
- answer must be -1.
- Include a complete but concise answerText.
- Preserve the given marks.
`
    : `
MCQ rules:
- Exactly 4 options per question.
- One correct answer.
- Answer index must be 0, 1, 2 or 3.
`
}

JSON:
{"questions":[{"id":"q1","question":"Question","options":[],"answer":-1,"answerText":"Answer","explanation":"Hint","topic":"Unit","difficulty":"Medium","marks":2}]}
`;
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
      `AI returned ${Array.isArray(list) ? list.length : 0} questions; ${marksPlan.length} required.`
    );
  }

  const seen = new Set<string>();

  return marksPlan.map((marks, index) => {
    const item = list[index] as Record<string, unknown>;
    const question = String(item.question || "").trim();

    if (question.length < 8) {
      throw new GenerationError(`Question ${index + 1} is incomplete.`);
    }

    const key = question.toLowerCase();

    if (seen.has(key)) {
      throw new GenerationError("AI returned duplicate questions.");
    }

    seen.add(key);

    const topic = String(
      item.topic || item.unit || fallbackTopic
    ).trim();

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
          `Question ${index + 1} has invalid MCQ options.`
        );
      }

      return {
        ...base,
        options,
        answer,
        answerText: options[answer],
      };
    }

    const answerText = String(
      item.answerText || item.modelAnswer || ""
    ).trim();

    if (!answerText) {
      throw new GenerationError(
        `Question ${index + 1} has no model answer.`
      );
    }

    return {
      ...base,
      options: [],
      answer: -1,
      answerText,
    };
  });
}

function classifyError(error: unknown): GenerationError {
  if (error instanceof GenerationError) return error;

  const message =
    error instanceof Error ? error.message : String(error);

  const status = Number(
    (error as { status?: number; code?: number })?.status ||
    (error as { code?: number })?.code
  );

  if (
    status === 503 ||
    status === 502 ||
    /UNAVAILABLE|high demand|overloaded/i.test(message)
  ) {
    return new GenerationError("Gemini service is temporarily busy.");
  }

  if (
    status === 429 ||
    /RESOURCE_EXHAUSTED|quota|rate limit/i.test(message)
  ) {
    return new GenerationError("Gemini API quota limit reached.", false);
  }

  if (status === 404 || /model not found|not supported/i.test(message)) {
    return new GenerationError("Configured Gemini model is unavailable.", false);
  }

  if ([400, 401, 403].includes(status)) {
    return new GenerationError(
      "Gemini API request rejected. Check your API key and model.",
      false
    );
  }

  return new GenerationError(message || "AI generation failed.");
}

async function generateWithTimeout(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  remaining: number,
  maxTokens: number
) {
  const controller = new AbortController();

  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new GenerationError("Gemini response timed out."));
    }, remaining);
  });

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: maxTokens,
          abortSignal: controller.signal,
        },
      }),
      timeout,
    ]);

    if (!response.text?.trim()) {
      throw new GenerationError("Gemini returned an empty response.");
    }

    return extractJson(response.text);
  } finally {
    clearTimeout(timer!);
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is missing on the server.",
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
        {
          success: false,
          error: "Invalid request body.",
          retryable: false,
        },
        { status: 400 }
      );
    }

    const subjectName = String(body.subjectName || "").trim();

    if (!subjectName) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject name is required.",
          retryable: false,
        },
        { status: 400 }
      );
    }

    const selected = Array.isArray(body.selectedUnits)
      ? body.selectedUnits
      : [];

    const syllabus = Array.isArray(body.syllabus)
      ? body.syllabus
      : [];

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

    let lastError = new GenerationError("AI generation failed.");

    for (const model of models) {
      const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);

      if (remaining < 8000) break;

      try {
        const initial = await generateWithTimeout(
          ai,
          model,
          prompt,
          Math.min(remaining - 5000, 42000),
          kind === "descriptive" ? 8192 : 4096
        );

        let questions = Array.isArray(initial.questions)
          ? initial.questions
          : [];

        if (questions.length < marksPlan.length) {
          const missingMarks = marksPlan.slice(questions.length);

          const continuationPrompt = buildContinuationPrompt(
            subjectName,
            units,
            kind,
            missingMarks,
            questions.map((q: any) => String(q.question || ""))
          );

          const timeLeft = TOTAL_BUDGET_MS - (Date.now() - startedAt);

          if (timeLeft < 5000) {
            throw new GenerationError(
              "AI returned incomplete questions and there is not enough time to complete the exam."
            );
          }

          const continuation = await generateWithTimeout(
            ai,
            model,
            continuationPrompt,
            Math.min(timeLeft - 1000, 18000),
            kind === "descriptive" ? 4096 : 2048
          );

          const additional = Array.isArray(continuation.questions)
            ? continuation.questions
            : [];

          questions = [...questions, ...additional];
        }

        const normalized = normalizeQuestions(
          { questions },
          kind,
          marksPlan,
          difficulty,
          subjectName
        );

        console.log(
          `Exam generated: model=${model}, questions=${normalized.length}, time=${Date.now() - startedAt}ms`
        );

        return NextResponse.json({
          success: true,
          subject: subjectName,
          examMode: mode,
          questionType: kind === "mcq" ? "MCQ" : "Descriptive",
          totalQuestions: normalized.length,
          totalMarks: marksPlan.reduce((sum, marks) => sum + marks, 0),
          model,
          questions: normalized,
        });
      } catch (error) {
        lastError = classifyError(error);

        console.error(
          `Exam generation failed for ${model}:`,
          error
        );

        if (!lastError.retryable) break;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: `${lastError.message} Please try again.`,
        retryable: lastError.retryable,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("GENERATE EXAM ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected exam generation error.",
        retryable: false,
      },
      { status: 500 }
    );
  }
}