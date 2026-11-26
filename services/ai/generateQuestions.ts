
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
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

export async function generateQuestions(
  input: GenerateQuestionInput
): Promise<GeneratedQuestion[]> {
  const count = Math.min(Math.max(Number(input.count) || 7, 1), 50);

  const prompt = `
Generate exactly ${count} university-level MCQs for SemShot.

Course: ${input.course}
Branch: ${input.branch}
Semester: ${input.semester}
Subject: ${input.subject}
Exam Type: ${input.examType}
Difficulty: ${input.difficulty}

Syllabus:
${input.units.map((unit, index) => `${index + 1}. ${unit}`).join("\n")}

Rules:
- Generate exactly ${count} unique questions.
- Follow only the given syllabus.
- Every question must have exactly 4 options.
- Answer must be an integer from 0 to 3.
- Include a short explanation.
- Include topic, difficulty and marks.
- Return only valid JSON.

Required format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "Short explanation",
      "difficulty": "medium",
      "topic": "Unit 1",
      "marks": 1
    }
  ]
}
`;

  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      const parsed = JSON.parse(text);

      if (
        !Array.isArray(parsed.questions) ||
        parsed.questions.length !== count
      ) {
        throw new Error("Invalid question count returned by Gemini");
      }

      return parsed.questions.map(
        (question: any, index: number): GeneratedQuestion => {
          const answer = Number(question.answer);

          if (
            typeof question.question !== "string" ||
            !Array.isArray(question.options) ||
            question.options.length !== 4 ||
            !Number.isInteger(answer) ||
            answer < 0 ||
            answer > 3
          ) {
            throw new Error(`Invalid question data at index ${index}`);
          }

          return {
            id: String(question.id || `ai-question-${index + 1}`),
            question: question.question,
            options: question.options.map(String),
            answer,
            explanation: String(question.explanation || ""),
            difficulty: ["easy", "medium", "hard"].includes(
              question.difficulty
            )
              ? question.difficulty
              : "medium",
            topic: String(question.topic || input.subject),
            marks: Math.max(1, Number(question.marks) || 1),
          };
        }
      );
    } catch (error) {
      lastError = error;
      console.error(`Gemini model ${model} failed:`, error);
    }
  }

  console.error("All Gemini models failed:", lastError);

  throw new Error(
    "AI generation is temporarily unavailable. Please try again."
  );
}
