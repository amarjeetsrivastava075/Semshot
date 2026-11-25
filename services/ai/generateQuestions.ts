import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
];

export type GenerateQuestionInput = {
  course: string;
  branch: string;
  semester: number;
  subject: string;
  units: string[];
  count: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  examType: "MST" | "END_SEM" | "PRACTICE" | "MOCK";
};

export type GeneratedQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  marks: number;
};

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function isTemporaryError(error: unknown) {
  const err = error as {
    status?: number;
    code?: number | string;
    message?: string;
  };

  const status = Number(err.status || err.code);

  return (
    [408, 429, 500, 502, 503, 504].includes(status) ||
    /high demand|overloaded|unavailable|rate limit|resource exhausted/i.test(
      err.message || ""
    )
  );
}

export async function generateQuestions(
  input: GenerateQuestionInput
): Promise<GeneratedQuestion[]> {
  const prompt = `
You are the official AI question generator for SemShot.

Generate exactly ${input.count} multiple-choice questions.

ACADEMIC INFORMATION

Course: ${input.course}
Branch: ${input.branch}
Semester: ${input.semester}
Subject: ${input.subject}

Syllabus Units:
${input.units.map((unit, index) => `${index + 1}. ${unit}`).join("\n")}

Exam Type: ${input.examType}
Difficulty: ${input.difficulty}

RULES

1. Generate exactly ${input.count} questions.
2. Questions must belong to the selected subject.
3. Questions must follow the provided syllabus.
4. Every question must have exactly 4 options.
5. Only one correct answer.
6. Answer must be an index from 0 to 3.
7. Include a clear explanation.
8. Include difficulty and relevant topic.
9. Avoid duplicate and ambiguous questions.
10. Questions must be suitable for university examinations.
11. Return only valid JSON in this exact structure:

{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Explanation",
      "difficulty": "medium",
      "topic": "Unit 1",
      "marks": 1
    }
  ]
}
`;

  let lastError: unknown;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (!response.text) {
          throw new Error("Gemini returned an empty response");
        }

        const parsed = JSON.parse(response.text);

        if (
          !Array.isArray(parsed.questions) ||
          parsed.questions.length !== input.count
        ) {
          throw new Error("Invalid question format returned by Gemini");
        }

        return parsed.questions.map(
          (question: any, index: number): GeneratedQuestion => {
            if (
              typeof question.question !== "string" ||
              !Array.isArray(question.options) ||
              question.options.length !== 4 ||
              !Number.isInteger(Number(question.answer)) ||
              Number(question.answer) < 0 ||
              Number(question.answer) > 3
            ) {
              throw new Error(`Invalid question data at index ${index}`);
            }

            return {
              id: question.id || `ai-question-${index + 1}`,
              question: question.question,
              options: question.options.map(String),
              answer: Number(question.answer),
              explanation: question.explanation || "",
              difficulty: question.difficulty || "medium",
              topic: question.topic || input.subject,
              marks: Number(question.marks || 1),
            };
          }
        );
      } catch (error) {
        lastError = error;

        if (!isTemporaryError(error)) {
          throw error;
        }

        if (attempt === 0) {
          await wait(1500);
        }
      }
    }
  }

  console.error("All Gemini models failed:", lastError);

  throw new Error(
    "AI exam generation is temporarily unavailable. Please try again in a minute."
  );
}