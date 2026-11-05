"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
  code?: string;
  credits?: number;
  units?: string[];
  syllabus?: string[];
  description?: string;
  courseId?: string;
  courseName?: string;
  branchId?: string;
  branchName?: string;
  semesterId?: string;
  semesterName?: string;
};

type GeneratedQuestion = {
  id: string;
  question: string;
  options?: string[];
  answer?: number;
  answerText?: string;
  explanation?: string;
  unit?: string;
  difficulty?: string;
  marks?: number;
};

type GeneratedExam = {
  subject: string;
  questions: GeneratedQuestion[];
};

type ExamMode = "practice" | "mst" | "endsem";

const difficultyOptions = [
  {
    value: "Easy",
    title: "Easy",
    description: "Basic concepts and direct questions",
  },
  {
    value: "Medium",
    title: "Medium",
    description: "University-level conceptual questions",
  },
  {
    value: "Hard",
    title: "Hard",
    description: "Advanced and application-based questions",
  },
];

const questionTypes = [
  {
    value: "MCQ",
    title: "MCQ",
    description: "Multiple choice questions",
  },
  {
    value: "Descriptive",
    title: "Descriptive",
    description: "Written university-style questions",
  },
];

const examModes: {
  value: ExamMode;
  title: string;
  description: string;
  icon: typeof Brain;
}[] = [
  {
    value: "practice",
    title: "Practice Test",
    description: "Practice with AI-generated questions",
    icon: Brain,
  },
  {
    value: "mst",
    title: "MST",
    description: "7 descriptive questions · 20 marks",
    icon: FileQuestion,
  },
  {
    value: "endsem",
    title: "End Sem",
    description: "Descriptive full semester examination",
    icon: GraduationCap,
  },
];

export default function AddExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectIdFromUrl = searchParams.get("subjectId");
  const modeFromUrl = searchParams.get("mode");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState(subjectIdFromUrl || "");
  const [subject, setSubject] = useState<Subject | null>(null);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("MCQ");
  const [examMode, setExamMode] = useState<ExamMode>("practice");

  const [duration, setDuration] = useState(20);
  const [examPattern, setExamPattern] = useState("");

  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const [exam, setExam] = useState<GeneratedExam | null>(null);

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

const [evaluationResults, setEvaluationResults] = useState<
  {
    questionId: string;
    marksObtained: number;
    maxMarks: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }[]
>([]);

const [aiScore, setAiScore] = useState(0);
const [aiTotalMarks, setAiTotalMarks] = useState(0);
const [aiPercentage, setAiPercentage] = useState(0);
const [overallFeedback, setOverallFeedback] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (modeFromUrl === "mst") {
      setExamMode("mst");
      setQuestionType("Descriptive");
      setQuestionCount(7);
      setDuration(30);
      setExamPattern(`
MST Pattern:
- Mid Semester Test
- Total Marks: 20
- Total Questions: 7
- Questions 1-5: 2 marks each
- Questions 6-7: 5 marks each
- Descriptive questions only
- No MCQs
- No options
- Answers should be written according to the marks
- 2 mark answers should be concise
- 5 mark answers should be moderately detailed
- Questions should be university-level
- Focus on important concepts from selected syllabus
`);
    }

    if (modeFromUrl === "end-sem" || modeFromUrl === "endsem") {
      setExamMode("endsem");
      setQuestionType("Descriptive");
      setQuestionCount(20);
      setDuration(90);
      setExamPattern(`
End Semester Examination Pattern:
- Total Marks: 50
- Descriptive questions only
- No MCQs
- No options
- Complete syllabus examination
- Unit 1: 7 marks
- Unit 2: 7 marks
- Unit 3: 7 marks
- Unit 4: 10 marks
- Unit 5: 19 marks
- Questions should cover the complete selected syllabus
- Focus on conceptual, analytical and application-based questions
- Answers must be according to the marks
- Do not make answers unnecessarily long
- University-level difficulty
`);
    }

    if (!modeFromUrl) {
      setExamMode("practice");
      setQuestionType("MCQ");
    }
  }, [modeFromUrl]);

  useEffect(() => {
    if (subjectIdFromUrl) {
      setSubjectId(subjectIdFromUrl);
    }
  }, [subjectIdFromUrl]);

  useEffect(() => {
    if (!subjectId) {
      setSubject(null);
      return;
    }

    loadSelectedSubject(subjectId);
  }, [subjectId, subjects]);

  useEffect(() => {
    if (!subject) {
      setSelectedUnits([]);
      return;
    }

    const subjectUnits = getSubjectUnits(subject);
    setSelectedUnits(subjectUnits);
  }, [subject]);

  useEffect(() => {
    if (!started || submitted || !exam) {
      return;
    }

    if (timeLeft <= 0) {
      finishExam();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [started, submitted, exam, timeLeft]);

  async function loadSubjects() {
    try {
      setLoadingSubjects(true);

      const response = await fetch("/api/subjects", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load subjects");
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.subjects)
          ? data.subjects
          : [];

      const normalized = list.map((item: any) => ({
  id: String(item.id || item.subjectId || ""),
  name: String(item.name || item.subjectName || "Unnamed Subject"),
  code: item.code || item.subjectCode || "",
  credits: item.credits || 0,
  units: Array.isArray(item.units) ? item.units : [],
  syllabus: Array.isArray(item.syllabus) ? item.syllabus : [],
  description: item.description || "",
  courseId: item.courseId || "",
  courseName: item.courseName || "",
  branchId: item.branchId || "",
  branchName: item.branchName || "",
  semesterId: item.semesterId || "",
  semesterName: item.semesterName || "",
}));

      setSubjects(normalized);

      if (subjectIdFromUrl) {
        const found = normalized.find(
          (item: Subject) => item.id === subjectIdFromUrl
        );

        if (found) {
          setSubject(found);
        }
      }
    } catch (error) {
      console.error(error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  }

  async function loadSelectedSubject(id: string) {
    const localSubject = subjects.find((item) => item.id === id);

    if (localSubject) {
      setSubject(localSubject);
      return;
    }

    try {
      setLoadingSubject(true);

      const response = await fetch(`/api/subjects/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const item = data.subject || data;

      if (!item) {
        return;
      }

      const normalized: Subject = {
        id: String(item.id || item.subjectId || id),
        name: String(item.name || item.subjectName || "Unnamed Subject"),
        code: item.code || item.subjectCode || "",
        credits: item.credits || 0,
        units: Array.isArray(item.units) ? item.units : [],
        syllabus: Array.isArray(item.syllabus) ? item.syllabus : [],
        description: item.description || "",
      };

      setSubject(normalized);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubject(false);
    }
  }

  function getSubjectUnits(currentSubject: Subject) {
    if (
      Array.isArray(currentSubject.units) &&
      currentSubject.units.length > 0
    ) {
      return currentSubject.units;
    }

    if (
      Array.isArray(currentSubject.syllabus) &&
      currentSubject.syllabus.length > 0
    ) {
      return currentSubject.syllabus;
    }

    return [];
  }

  const units = useMemo(() => {
    if (!subject) {
      return [];
    }

    return getSubjectUnits(subject);
  }, [subject]);

  const allUnitsSelected =
    units.length > 0 && selectedUnits.length === units.length;

  const current = exam?.questions[currentQuestion];

  const answeredCount = Object.keys(answers).filter((key) => {
    const answer = answers[Number(key)];

    if (typeof answer === "string") {
      return answer.trim().length > 0;
    }

    return answer !== undefined;
  }).length;

  const totalMarks = useMemo(() => {
    if (!exam) {
      return 0;
    }

    return exam.questions.reduce(
      (total, question) => total + Number(question.marks || 1),
      0
    );
  }, [exam]);

  const score = useMemo(() => {
    if (!exam) {
      return 0;
    }

    if (examMode === "practice") {
      return exam.questions.reduce((total, question, index) => {
        return total + (answers[index] === question.answer ? 1 : 0);
      }, 0);
    }

    return exam.questions.reduce((total, question, index) => {
      const answer = answers[index];

      if (typeof answer !== "string" || !answer.trim()) {
        return total;
      }

      const marks = Number(question.marks || 1);

      const words = answer.trim().split(/\s+/).length;

      if (marks <= 2) {
        if (words >= 15) return total + marks;
        if (words >= 8) return total + marks * 0.75;
        if (words >= 4) return total + marks * 0.5;
        return total;
      }

      if (marks <= 5) {
        if (words >= 60) return total + marks;
        if (words >= 40) return total + marks * 0.8;
        if (words >= 25) return total + marks * 0.6;
        if (words >= 10) return total + marks * 0.4;
        return total;
      }

      if (words >= marks * 12) return total + marks;
      if (words >= marks * 8) return total + marks * 0.8;
      if (words >= marks * 5) return total + marks * 0.6;
      return total;
    }, 0);
  }, [exam, answers, examMode]);

  const percentage = useMemo(() => {
    if (!exam || totalMarks === 0) {
      return 0;
    }

    return Math.round((score / totalMarks) * 100);
  }, [exam, score, totalMarks]);

  function toggleUnit(unit: string) {
    setSelectedUnits((previous) => {
      if (previous.includes(unit)) {
        return previous.filter((item) => item !== unit);
      }

      return [...previous, unit];
    });
  }

  function toggleAllUnits() {
    if (allUnitsSelected) {
      setSelectedUnits([]);
      return;
    }

    setSelectedUnits(units);
  }

  function getQuestionCount() {
    if (examMode === "mst") {
      return 7;
    }

    if (examMode === "endsem") {
      return Math.min(Math.max(questionCount, 10), 50);
    }

    return Math.min(Math.max(questionCount, 5), 50);
  }

  function getDefaultPattern() {
    if (examMode === "mst") {
      return `
MST Pattern:
- Total Marks: 20
- Total Questions: 7
- Q1-Q5 = 2 marks each
- Q6-Q7 = 5 marks each
- Descriptive only
- No MCQ
- No options
- Student will type answers
`;
    }

    if (examMode === "endsem") {
      return `
End Semester Pattern:
- Total Marks: 50
- Descriptive only
- No MCQ
- No options
- Unit 1 = 7 marks
- Unit 2 = 7 marks
- Unit 3 = 7 marks
- Unit 4 = 10 marks
- Unit 5 = 19 marks
- Answers should be according to marks
`;
    }

    return `
Practice Test:
- AI-generated practice examination
- MCQ questions
- Four options per question
`;
  }

  function getMarksForQuestion(index: number) {
    if (examMode === "mst") {
      return index < 5 ? 2 : 5;
    }

    if (examMode === "endsem") {
      if (index < 3) return 2;
      if (index < 6) return 3;
      if (index < 9) return 4;
      return 5;
    }

    return 1;
  }

  async function generateExam() {
    setGenerationError("");

    if (!subject) {
      setGenerationError("Please select a subject first.");
      return;
    }

    if (units.length === 0) {
      setGenerationError(
        "This subject does not have a syllabus yet. Add syllabus units first."
      );
      return;
    }

    if (selectedUnits.length === 0) {
      setGenerationError("Please select at least one syllabus unit.");
      return;
    }

    const count = getQuestionCount();

    try {
      setGenerating(true);

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: subject.name,
          subjectCode: subject.code || "",
          syllabus: units,
          selectedUnits,
          questionCount: count,
          difficulty,
          questionType:
            examMode === "mst" || examMode === "endsem"
              ? "Descriptive"
              : questionType,
          examPattern: examPattern.trim() || getDefaultPattern(),
          examMode,
        }),
      });

      const raw = await response.text();

      let data: any;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}). ${raw.slice(
            0,
            500
          )}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Exam generation failed with status ${response.status}`
        );
      }

      if (!data?.success) {
        throw new Error(data?.error || "Exam generation failed");
      }

      if (!data?.questions || !Array.isArray(data.questions)) {
        throw new Error("AI did not return valid questions.");
      }

      const normalizedQuestions: GeneratedQuestion[] = data.questions
        .map((question: any, index: number) => {
          const descriptive =
            examMode === "mst" || examMode === "endsem";

          return {
            id: String(question.id || `q${index + 1}`),
            question: String(
              question.question || `Question ${index + 1}`
            ),
            options: Array.isArray(question.options)
              ? question.options.map((option: any) => String(option))
              : [],
            answer:
              question.answer !== undefined
                ? Number(question.answer)
                : undefined,
            answerText: question.answerText
              ? String(question.answerText)
              : "",
            explanation: String(question.explanation || ""),
            unit: String(question.unit || ""),
            difficulty: String(question.difficulty || difficulty),
            marks: descriptive
              ? Number(question.marks || getMarksForQuestion(index))
              : 1,
          };
        })
        .filter((question: GeneratedQuestion) => {
          if (examMode === "practice") {
            return (
              question.question &&
              question.options?.length === 4 &&
              question.answer !== undefined &&
              question.answer >= 0 &&
              question.answer < 4
            );
          }

          return Boolean(question.question);
        });

      if (normalizedQuestions.length === 0) {
        throw new Error("AI generated no valid questions.");
      }

      let finalQuestions = normalizedQuestions;

      if (examMode === "mst") {
        finalQuestions = normalizedQuestions
          .slice(0, 7)
          .map((question, index) => ({
            ...question,
            marks: index < 5 ? 2 : 5,
            options: [],
            answer: undefined,
          }));

        if (finalQuestions.length < 7) {
          throw new Error(
            "MST requires exactly 7 descriptive questions. Please generate again."
          );
        }
      }

      if (examMode === "endsem") {
        finalQuestions = normalizedQuestions
          .slice(0, count)
          .map((question, index) => ({
            ...question,
            marks: Number(
              question.marks || getMarksForQuestion(index)
            ),
            options: [],
            answer: undefined,
          }));
      }

      setExam({
        subject: data.subject || subject.name,
        questions: finalQuestions,
      });

      setStarted(false);
      setSubmitted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(duration * 60);
    } catch (error) {
      console.error(error);

      setGenerationError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the exam."
      );
    } finally {
      setGenerating(false);
    }
  }

  function startExam() {
    if (!exam || exam.questions.length === 0) {
      return;
    }

    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setTimeLeft(duration * 60);
    setStarted(true);
  }

  function chooseAnswer(optionIndex: number) {
    if (submitted) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: optionIndex,
    }));
  }

  function writeAnswer(value: string) {
    if (submitted) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: value,
    }));
  }

  function goNext() {
    if (!exam) {
      return;
    }

    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function goPrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  }

  function jumpToQuestion(index: number) {
    if (!exam) {
      return;
    }

    setCurrentQuestion(index);
  }

  async function finishExam() {
  if (!exam || evaluating) {
    return;
  }

  if (examMode === "practice") {
    const result = {
      id: Date.now().toString(),
      subject:
        exam.subject ||
        subject?.name ||
        "Unknown Subject",
      score,
      total: exam.questions.length,
      percentage,
      mode: examMode,
      date: new Date().toISOString(),
    };

    const existingResults = JSON.parse(
      localStorage.getItem(
        "semshot_exam_results"
      ) || "[]"
    );

    localStorage.setItem(
      "semshot_exam_results",
      JSON.stringify([
        result,
        ...existingResults,
      ])
    );

    setStarted(false);
    setSubmitted(true);
    return;
  }

  try {
    setEvaluating(true);

    const response = await fetch(
      "/api/evaluate-exam",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName:
            exam.subject ||
            subject?.name ||
            "Unknown Subject",
          examMode,
          questions: exam.questions,
          answers,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data?.error ||
          "AI evaluation failed"
      );
    }

    setEvaluationResults(
      Array.isArray(data.evaluations)
        ? data.evaluations
        : []
    );

    setAiScore(
      Number(data.marksObtained || 0)
    );

    setAiTotalMarks(
      Number(data.totalMarks || 0)
    );

    setAiPercentage(
      Number(data.percentage || 0)
    );

    setOverallFeedback(
      String(
        data.overallFeedback || ""
      )
    );

    const result = {
      id: Date.now().toString(),
      subject:
        exam.subject ||
        subject?.name ||
        "Unknown Subject",
      score: Number(
        data.marksObtained || 0
      ),
      total: Number(
        data.totalMarks || 0
      ),
      percentage: Number(
        data.percentage || 0
      ),
      mode: examMode,
      date: new Date().toISOString(),
    };

    const existingResults = JSON.parse(
      localStorage.getItem(
        "semshot_exam_results"
      ) || "[]"
    );

    localStorage.setItem(
      "semshot_exam_results",
      JSON.stringify([
        result,
        ...existingResults,
      ])
    );

    setStarted(false);
    setSubmitted(true);
  } catch (error) {
    console.error(error);

    setGenerationError(
      error instanceof Error
        ? error.message
        : "AI evaluation failed. Please try again."
    );
  } finally {
    setEvaluating(false);
  }
}
  function createNewExam() {
    setExam(null);
    setStarted(false);
    setSubmitted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(duration * 60);
    setGenerationError("");
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function getOptionLetter(index: number) {
    return String.fromCharCode(65 + index);
  }

  function getAnswerPlaceholder(marks: number) {
    if (marks <= 2) {
      return "Write a concise answer in about 2–4 lines...";
    }

    if (marks <= 5) {
      return "Write a moderately detailed answer in about 8–12 lines...";
    }

    return "Write a detailed but focused answer according to the marks...";
  }

  if (loadingSubjects) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading subjects...
          </div>
        </div>
      </main>
    );
  }

  if (submitted && exam) {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={createNewExam}
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Create New Exam
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-zinc-950 to-purple-950/30 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/15 ring-1 ring-blue-500/30">
              <Trophy className="h-10 w-10 text-blue-400" />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
              Exam Completed
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              {exam.subject}
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              {examMode === "practice"
                ? "Your MCQ practice result is ready."
                : "Your descriptive exam has been evaluated by SemShot AI."}
            </p>

            <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-zinc-500">Score</p>

                <p className="mt-2 text-3xl font-bold">
                  {examMode === "practice"
                    ? `${score}/${exam.questions.length}`
                    : `${aiScore}/${aiTotalMarks}`}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-zinc-500">Percentage</p>

                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {examMode === "practice"
                    ? `${percentage}%`
                    : `${aiPercentage}%`}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-zinc-500">Answered</p>

                <p className="mt-2 text-3xl font-bold">
                  {examMode === "practice"
                    ? `${answeredCount}/${exam.questions.length}`
                    : `${evaluationResults.length}/${exam.questions.length}`}
                </p>
              </div>
            </div>

            {examMode !== "practice" && (
              <div className="mt-7 w-full max-w-3xl rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />

                  <h3 className="font-semibold text-blue-400">
                    AI Performance Feedback
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {overallFeedback ||
                    "AI evaluation completed. Review the question-wise feedback below to improve your preparation."}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                onClick={startExam}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 font-medium transition hover:bg-white/[0.1]"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Exam
              </button>

              <button
                onClick={createNewExam}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
              >
                <Sparkles className="h-4 w-4" />
                Generate New Exam
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {exam.questions.map((question, index) => {
  const isCurrent = index === currentQuestion;

const answer = answers[index];

const isAnswered =
  examMode === "practice"
    ? typeof answer === "number"
    : typeof answer === "string" && answer.trim().length > 0;

  return (
    <button
      key={question.id}
      onClick={() => jumpToQuestion(index)}
      className={`flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition ${
        isCurrent
          ? "bg-blue-600 text-white ring-2 ring-blue-400/30"
          : isAnswered
            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
            : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08]"
      }`}
    >
      {index + 1}
    </button>
  );
})}
        </section>
      </div>
    </main>
  );
}

  if (started && exam && current) {
    const selectedAnswer = answers[currentQuestion];
    const progress =
      ((currentQuestion + 1) / exam.questions.length) * 100;

    const currentMarks = Number(current.marks || 1);

    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">SemShot AI Exam</p>

              <h1 className="truncate text-sm font-semibold md:text-base">
                {exam.subject}
              </h1>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                timeLeft <= 60
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-blue-500/20 bg-blue-500/10 text-blue-400"
              }`}
            >
              <Clock3 className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="h-1 bg-white/5">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_280px] md:px-8">
          <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">
                  Question {currentQuestion + 1} of{" "}
                  {exam.questions.length}
                </p>

                {current.unit && (
                  <p className="mt-1 text-xs text-blue-400">
                    {current.unit}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {examMode !== "practice" && (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {currentMarks} Marks
                  </span>
                )}

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
                  {current.difficulty || difficulty}
                </span>
              </div>
            </div>

            <h2 className="mt-8 text-xl font-semibold leading-8 md:text-2xl">
              {current.question}
            </h2>

            {examMode === "practice" ? (
              <div className="mt-8 space-y-3">
                {current.options?.map((option, index) => {
                  const selected = selectedAnswer === index;

                  return (
                    <button
                      key={`${current.id}-${index}`}
                      onClick={() => chooseAnswer(index)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-white/[0.05] text-zinc-400"
                        }`}
                      >
                        {getOptionLetter(index)}
                      </span>

                      <span
                        className={
                          selected ? "text-white" : "text-zinc-300"
                        }
                      >
                        {option}
                      </span>

                      {selected && (
                        <Check className="ml-auto h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    Write your answer
                  </p>

                  <p className="text-xs text-zinc-600">
                    {currentMarks === 2
                      ? "Short answer"
                      : currentMarks <= 5
                        ? "Moderate answer"
                        : "Detailed answer"}
                  </p>
                </div>

                <textarea
                  value={
                    typeof selectedAnswer === "string"
                      ? selectedAnswer
                      : ""
                  }
                  onChange={(event) =>
                    writeAnswer(event.target.value)
                  }
                  placeholder={getAnswerPlaceholder(currentMarks)}
                  className="min-h-[260px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />

                <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    Write only what is required according to the marks.
                  </span>

                  <span>
                    {typeof selectedAnswer === "string"
                      ? selectedAnswer.length
                      : 0}{" "}
                    characters
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
              <button
                onClick={goPrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {currentQuestion === exam.questions.length - 1 ? (
                <button
  onClick={finishExam}
  disabled={evaluating}
  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {evaluating ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      AI Checking...
    </>
  ) : (
    <>
      <CheckCircle2 className="h-4 w-4" />
      Submit Exam
    </>
  )}
</button>
              ) : (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-950/80 p-5 md:sticky md:top-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Questions</p>

                <p className="mt-1 text-xs text-zinc-500">
                  {answeredCount} answered
                </p>
              </div>

              <Target className="h-5 w-5 text-blue-400" />
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {exam.questions.map((question, index) => {
  const isCurrent = index === currentQuestion;

  const answer = answers[index];

  const isAnswered =
    examMode === "practice"
      ? typeof answer === "number"
      : typeof answer === "string" && answer.trim().length > 0;

  return (
    <button
      key={question.id}
      type="button"
      onClick={() => jumpToQuestion(index)}
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
        isCurrent
          ? "bg-blue-600 text-white ring-2 ring-blue-400/30"
          : isAnswered
            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
            : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08]"
      }`}
    >
      {index + 1}
    </button>
  );
})}
            </div>

            <div className="mt-6 space-y-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Current
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Answered
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                Unanswered
              </div>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  if (exam && !started) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-8 text-white md:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={createNewExam}
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exam Setup
          </button>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-zinc-950 to-purple-950/30 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generated Exam
                </div>

                <h1 className="text-3xl font-bold md:text-5xl">
                  {exam.subject}
                </h1>

                <p className="mt-3 max-w-2xl text-zinc-400">
                  {examMode === "practice"
                    ? "Your personalized MCQ practice test is ready."
                    : "Your descriptive university examination is ready. Write answers according to the marks."}
                </p>
              </div>

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-blue-500/10 ring-1 ring-blue-500/20">
                {examMode === "practice" ? (
                  <Brain className="h-12 w-12 text-blue-400" />
                ) : (
                  <GraduationCap className="h-12 w-12 text-blue-400" />
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Questions</p>
                <p className="mt-2 text-2xl font-bold">
                  {exam.questions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Total Marks</p>
                <p className="mt-2 text-2xl font-bold">
                  {totalMarks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Duration</p>
                <p className="mt-2 text-2xl font-bold">
                  {duration} min
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Mode</p>
                <p className="mt-2 text-2xl font-bold">
                  {examMode === "mst"
                    ? "MST"
                    : examMode === "endsem"
                      ? "End Sem"
                      : "Practice"}
                </p>
              </div>
            </div>

            {examMode !== "practice" && (
              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm font-semibold text-blue-400">
                  Descriptive Examination
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  No MCQ options will be shown. You will type your own
                  answers and should keep the answer length appropriate
                  to the marks.
                </p>
              </div>
            )}

            <button
              onClick={startExam}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Exam
            </button>
          </section>

          <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Generated Questions
              </h2>

              <span className="text-sm text-zinc-500">
                {exam.questions.length} questions
              </span>
            </div>

            {exam.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-7">
                        {question.question}
                      </h3>

                      {examMode !== "practice" && (
                        <span className="shrink-0 rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                          {question.marks} Marks
                        </span>
                      )}
                    </div>

                    {question.unit && (
                      <p className="mt-2 text-xs text-blue-400">
                        {question.unit}
                      </p>
                    )}

                    {examMode === "practice" && (
                      <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {question.options?.map(
                          (option, optionIndex) => (
                            <div
                              key={`${question.id}-${optionIndex}`}
                              className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-400"
                            >
                              <span className="mr-2 font-semibold text-zinc-500">
                                {getOptionLetter(optionIndex)}.
                              </span>
                              {option}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {examMode !== "practice" && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-500">
                        Student will write the answer according to{" "}
                        {question.marks} marks.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/dashboard/exams")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exams
        </button>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI Exam Generator
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Create AI Exam
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Select your subject and syllabus. SemShot AI will generate
            an examination based on your academic content.
          </p>
        </div>

        {generationError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex gap-3">
              <XCircle className="h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="font-medium text-red-300">
                  Generation failed
                </p>

                <p className="mt-1 text-sm leading-6 text-red-300/70">
                  {generationError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h2 className="font-semibold">Select Subject</h2>
                  <p className="text-xs text-zinc-500">
                    Choose the subject for your exam
                  </p>
                </div>
              </div>

              <div className="mt-5">
 <select
  value={subject?.id || ""}
  onChange={(e) => {
    const selected = subjects.find(
      (item) => item.id === e.target.value
    );

    setSubject(selected || null);
    setSubjectId(e.target.value);
  }}
  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white"
>
  <option value="">Select Subject</option>

  {subjects.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name} {item.code ? `(${item.code})` : ""}
    </option>
  ))}
</select>

{!loadingSubjects && subjects.length === 0 && (
  <p className="mt-2 text-sm text-red-400">
    No subjects found. Please try again.
  </p>
)}

                {loadingSubject && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading subject...
                  </div>
                )}

                {subject && (
                  <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          {subject.name}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {subject.code && (
                            <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-400">
                              {subject.code}
                            </span>
                          )}

                          {subject.credits ? (
                            <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-400">
                              {subject.credits} Credits
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Syllabus & Units
                    </h2>

                    <p className="text-xs text-zinc-500">
                      Choose what AI should use
                    </p>
                  </div>
                </div>

                {units.length > 0 && (
                  <button
                    onClick={toggleAllUnits}
                    className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    {allUnitsSelected ? "Clear All" : "Select All"}
                  </button>
                )}
              </div>

              {!subject ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-zinc-700" />

                  <p className="mt-3 text-sm text-zinc-500">
                    Select a subject to see its syllabus.
                  </p>
                </div>
              ) : units.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-yellow-500/20 bg-yellow-500/5 p-6">
                  <p className="font-medium text-yellow-300">
                    Syllabus not available
                  </p>

                  <p className="mt-1 text-sm leading-6 text-yellow-300/60">
                    Add syllabus units to this subject before
                    generating an AI exam.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  {units.map((unit, index) => {
                    const selected = selectedUnits.includes(unit);

                    return (
                      <button
                        key={`${unit}-${index}`}
                        onClick={() => toggleUnit(unit)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-blue-500/30 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-white/[0.05] text-zinc-500"
                          }`}
                        >
                          {selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </span>

                        <span
                          className={
                            selected
                              ? "text-white"
                              : "text-zinc-400"
                          }
                        >
                          {unit}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                  <GraduationCap className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <h2 className="font-semibold">Exam Mode</h2>
                  <p className="text-xs text-zinc-500">
                    Choose how you want to prepare
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {examModes.map((mode) => {
                  const Icon = mode.icon;
                  const selected = examMode === mode.value;

                  return (
                    <button
                      key={mode.value}
                      onClick={() => {
                        setExamMode(mode.value);

                        if (
                          mode.value === "mst" ||
                          mode.value === "endsem"
                        ) {
                          setQuestionType("Descriptive");
                        } else {
                          setQuestionType("MCQ");
                        }

                        if (mode.value === "mst") {
                          setQuestionCount(7);
                          setDuration(30);
                        }

                        if (mode.value === "endsem") {
                          setQuestionCount(20);
                          setDuration(90);
                        }
                      }}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500/30 bg-blue-500/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-white/[0.05] text-zinc-500"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">
                          {mode.title}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {mode.description}
                        </p>
                      </div>

                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                  <Zap className="h-5 w-5 text-orange-400" />
                </div>

                <div>
                  <h2 className="font-semibold">Exam Pattern</h2>

                  <p className="text-xs text-zinc-500">
                    Instructions for the AI
                  </p>
                </div>
              </div>

              <textarea
                value={examPattern}
                onChange={(event) =>
                  setExamPattern(event.target.value)
                }
                rows={8}
                className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-blue-500"
              />
            </section>
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-6">
            <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h2 className="font-semibold">AI Settings</h2>

                  <p className="text-xs text-zinc-500">
                    Customize your exam
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Questions
                    </label>

                    <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                      {getQuestionCount()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={questionCount}
                    disabled={
                      examMode === "mst"
                    }
                    onChange={(event) =>
                      setQuestionCount(
                        Number(event.target.value)
                      )
                    }
                    className="mt-4 w-full accent-blue-600"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-zinc-600">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Difficulty
                  </label>

                  <div className="mt-3 space-y-2">
                    {difficultyOptions.map((item) => (
                      <button
                        key={item.value}
                        onClick={() =>
                          setDifficulty(item.value)
                        }
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          difficulty === item.value
                            ? "border-blue-500/30 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-500">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Question Type
                  </label>

                  <div className="mt-3">
                    {questionTypes.map((item) => {
                      const disabled =
                        examMode === "mst" ||
                        examMode === "endsem";

                      return (
                        <button
                          key={item.value}
                          disabled={disabled}
                          onClick={() =>
                            setQuestionType(item.value)
                          }
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            questionType === item.value
                              ? "border-blue-500/30 bg-blue-500/10"
                              : "border-white/10 bg-white/[0.02]"
                          } ${
                            disabled
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {item.title}
                          </p>

                          <p className="mt-1 text-[11px] text-zinc-500">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {(examMode === "mst" ||
                    examMode === "endsem") && (
                    <p className="mt-2 text-xs text-blue-400">
                      Descriptive mode is locked for this exam.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Duration
                    </label>

                    <span className="text-xs text-zinc-500">
                      {duration} minutes
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[10, 20, 30, 45, 60, 90].map(
                      (minutes) => (
                        <button
                          key={minutes}
                          onClick={() =>
                            setDuration(minutes)
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                            duration === minutes
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                              : "border-white/10 bg-white/[0.02] text-zinc-500 hover:bg-white/[0.05]"
                          }`}
                        >
                          {minutes}m
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-blue-400" />

                <div>
                  <p className="font-semibold">
                    Ready to generate?
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    AI will analyze the selected subject and
                    syllabus and create university-level
                    questions.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Subject-aware questions
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Syllabus-based generation
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Marks-based descriptive questions
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Automatic result saving
                </div>
              </div>

              <button
                onClick={generateExam}
                disabled={
                  generating ||
                  !subject ||
                  selectedUnits.length === 0
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Exam...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate AI Exam
                  </>
                )}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}