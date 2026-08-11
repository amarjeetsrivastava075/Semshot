import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

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
  const prompt = `
You are the official AI question generator for SemShot, an academic examination platform.

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
2. Every question must belong to the selected subject.
3. Every question must be related to the provided syllabus units.
4. Do not generate questions outside the syllabus.
5. Every question must have exactly 4 options.
6. There must be exactly one correct answer.
7. The answer must be represented as an index from 0 to 3.
8. Provide a clear explanation for the correct answer.
9. Provide the difficulty.
10. Provide the relevant topic/unit.
11. Avoid duplicate questions.
12. Avoid ambiguous questions.
13. Questions should be suitable for university examinations.
14. Do not mention that you are an AI.
15. Return only valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = JSON.parse(response.text);

  if (!Array.isArray(parsed.questions)) {
    throw new Error("Invalid question format returned by Gemini");
  }

  return parsed.questions.map((question: any, index: number) => ({
    id: question.id || `ai-question-${index + 1}`,
    question: question.question,
    options: question.options,
    answer: Number(question.answer),
    explanation: question.explanation,
    difficulty: question.difficulty || "medium",
    topic: question.topic || input.subject,
    marks: Number(question.marks || 1),
  }));
}