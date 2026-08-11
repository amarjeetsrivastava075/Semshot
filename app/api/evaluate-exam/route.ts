import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type EvaluationResult = {
  questionId: string;
  marksObtained: number;
  maxMarks: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

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
      examMode,
      questions,
      answers,
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

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        {
          success: false,
          error: "Questions are required",
        },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Student answers are required",
        },
        { status: 400 }
      );
    }

    if (
      examMode !== "mst" &&
      examMode !== "endsem"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI descriptive evaluation is only available for MST and End Sem.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const evaluationQuestions = questions.map(
      (question: any, index: number) => {
        const studentAnswer =
          typeof answers[index] === "string"
            ? answers[index].trim()
            : "";

        return {
          questionId: String(
            question.id || `q${index + 1}`
          ),
          question: String(
            question.question || ""
          ),
          marks: Number(question.marks || 1),
          unit: String(question.unit || ""),
          modelAnswer: String(
            question.answerText || ""
          ),
          explanation: String(
            question.explanation || ""
          ),
          studentAnswer,
        };
      }
    );

    const prompt = `
You are an expert university examination evaluator for SemShot.

Evaluate the student's descriptive answers fairly.

Subject:
${subjectName}

Exam Mode:
${examMode === "mst" ? "MST" : "End Semester"}

IMPORTANT EVALUATION RULES:

1. Evaluate every question independently.
2. Compare the student's answer with the question.
3. Use the model answer as guidance, NOT as a requirement for exact wording.
4. Accept correct answers written in different words.
5. Give marks according to:
   - factual correctness
   - conceptual understanding
   - relevance
   - important points covered
   - accuracy
   - completeness appropriate to the marks
6. Do NOT give marks merely because the answer is long.
7. Do NOT reduce marks merely because the answer is short if it contains all required points.
8. Do NOT require exact textbook wording.
9. Do not penalize grammar heavily unless it makes the answer academically unclear.
10. If the student gives a partially correct answer, award partial marks.
11. If the student gives a completely incorrect answer, award 0.
12. If the student does not answer, award 0.
13. Never award more than the question's maximum marks.
14. Marks can be decimal values such as 1.5, 2.5, 3.5.
15. Feedback should be concise and useful to the student.
16. Mention what was done well.
17. Mention what should be improved.
18. Do not judge based only on word count.

ANSWER LENGTH GUIDANCE:

For 2 marks:
- Usually a short answer is enough.
- Important definition/concept/key points matter most.

For 3 marks:
- A concise explanation with important points is expected.

For 5 marks:
- A moderately detailed explanation is expected.
- Relevant examples, steps, formulas or applications should be considered where appropriate.

For 7-10 marks:
- The answer should be structured and reasonably detailed.
- Consider depth, explanation and coverage of important points.

For high-mark questions:
- Evaluate depth and completeness.
- Do not require unnecessarily huge answers.

Return ONLY valid JSON.

Return exactly this structure:

{
  "success": true,
  "evaluations": [
    {
      "questionId": "q1",
      "marksObtained": 1.5,
      "maxMarks": 2,
      "feedback": "Good understanding of the concept, but one important point is missing.",
      "strengths": [
        "Correct definition",
        "Relevant explanation"
      ],
      "improvements": [
        "Mention the key missing point"
      ]
    }
  ],
  "overallFeedback": "Overall performance feedback"
}

Questions and student answers:

${JSON.stringify(
  evaluationQuestions,
  null,
  2
)}
`;

    console.log(
      "Evaluating descriptive exam:",
      subjectName,
      examMode
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

    const text = response.text || "";

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!cleaned) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned an empty evaluation",
        },
        { status: 500 }
      );
    }

    let result: any;

    try {
      result = JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start === -1 || end === -1) {
        return NextResponse.json(
          {
            success: false,
            error: "Gemini returned invalid evaluation JSON",
            raw: cleaned.slice(0, 1500),
          },
          { status: 500 }
        );
      }

      try {
        result = JSON.parse(
          cleaned.slice(start, end + 1)
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            error:
              "Could not parse Gemini evaluation",
            raw: cleaned.slice(0, 1500),
          },
          { status: 500 }
        );
      }
    }

    if (
      !result ||
      !Array.isArray(result.evaluations)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini did not return valid evaluations",
        },
        { status: 500 }
      );
    }

    const evaluations: EvaluationResult[] =
      result.evaluations.map(
        (evaluation: any, index: number) => {
          const question =
            evaluationQuestions[index];

          const maxMarks = Number(
            question?.marks || 1
          );

          let marksObtained = Number(
            evaluation.marksObtained
          );

          if (
            Number.isNaN(marksObtained) ||
            marksObtained < 0
          ) {
            marksObtained = 0;
          }

          if (marksObtained > maxMarks) {
            marksObtained = maxMarks;
          }

          return {
            questionId: String(
              evaluation.questionId ||
                question?.questionId ||
                `q${index + 1}`
            ),
            marksObtained: Number(
              marksObtained.toFixed(1)
            ),
            maxMarks,
            feedback: String(
              evaluation.feedback ||
                "No feedback provided."
            ),
            strengths: Array.isArray(
              evaluation.strengths
            )
              ? evaluation.strengths.map(
                  (item: any) => String(item)
                )
              : [],
            improvements: Array.isArray(
              evaluation.improvements
            )
              ? evaluation.improvements.map(
                  (item: any) => String(item)
                )
              : [],
          };
        }
      );

    const totalMarks = evaluations.reduce(
      (total, item) =>
        total + item.maxMarks,
      0
    );

    const marksObtained = evaluations.reduce(
      (total, item) =>
        total + item.marksObtained,
      0
    );

    const percentage =
      totalMarks > 0
        ? Number(
            (
              (marksObtained / totalMarks) *
              100
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      success: true,
      evaluations,
      marksObtained: Number(
        marksObtained.toFixed(1)
      ),
      totalMarks,
      percentage,
      overallFeedback: String(
        result.overallFeedback ||
          "Keep practicing and improve your weak areas."
      ),
    });
  } catch (error) {
    console.error(
      "EVALUATE EXAM ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to evaluate exam",
      },
      { status: 500 }
    );
  }
}