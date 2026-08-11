"use client";

import {
  Brain,
  CheckCircle2,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import SectionPage from "@/components/dashboard/SectionPage";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: string;
  topic: string;
  marks: number;
};

export default function MCQsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  async function generateQuestions() {
    setLoading(true);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: "B.Tech",
          branch: "Computer Science & Engineering",
          semester: 3,
          subject: "Database Management System",
          units: [
            "Introduction to DBMS",
            "ER Model",
            "Relational Model",
            "SQL",
            "Normalization",
          ],
          count: 10,
          difficulty: "mixed",
          examType: "PRACTICE",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setQuestions(data.questions);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to generate questions"
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(index: number) {
    if (selected !== null) return;

    setSelected(index);

    if (index === questions[current].answer) {
      setScore((value) => value + 1);
    }
  }

  function nextQuestion() {
    setSelected(null);
    setCurrent((value) => value + 1);
  }

  function restart() {
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
  }

  const question = questions[current];

  return (
    <SectionPage
      title="AI MCQ Practice"
      description="Generate fresh university-level questions using AI."
      icon={<Brain className="h-7 w-7" />}
      action={
        loading
          ? "Generating..."
          : questions.length
          ? "New Test"
          : "Generate Test"
      }
      onAction={questions.length ? restart : generateQuestions}
    >
      {loading && (
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />

            <h2 className="mt-5 text-xl font-semibold text-white">
              Generating your test...
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              AI is preparing questions from the selected syllabus.
            </p>
          </div>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-500">
              <Brain className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              AI-Powered Test Generator
            </h2>

            <p className="mt-3 leading-7 text-zinc-400">
              Generate a fresh test from your course, branch,
              semester and subject.
            </p>

            <button
              onClick={generateQuestions}
              className="mt-7 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Generate 10 Questions
            </button>
          </div>
        </div>
      )}

      {!loading && question && (
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Database Management System
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-300">
                Question {current + 1} of {questions.length}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2">
              <span className="text-sm text-zinc-400">
                Score:
              </span>

              <span className="ml-2 font-bold text-blue-400">
                {score}
              </span>
            </div>
          </div>

          <div className="mb-5 h-2 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-400">
                {question.topic}
              </span>

              <span className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
                {question.difficulty}
              </span>

              <span className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
                {question.marks} mark
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold leading-8 text-white md:text-2xl">
              {question.question}
            </h2>

            <div className="mt-8 space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = index === question.answer;
                const showCorrect = selected !== null && isCorrect;
                const showWrong =
                  selected !== null && isSelected && !isCorrect;

                return (
                  <button
                    key={`${question.id}-${index}`}
                    onClick={() => selectAnswer(index)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      showCorrect
                        ? "border-green-500/50 bg-green-500/10"
                        : showWrong
                        ? "border-red-500/50 bg-red-500/10"
                        : isSelected
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800 font-semibold text-white">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1 text-zinc-300">
                      {option}
                    </span>

                    {showCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}

                    {showWrong && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div
                className={`mt-6 rounded-2xl border p-5 ${
                  selected === question.answer
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <p
                  className={`font-semibold ${
                    selected === question.answer
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selected === question.answer
                    ? "Correct Answer"
                    : "Incorrect Answer"}
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {question.explanation}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => {
                  if (current > 0) {
                    setCurrent((value) => value - 1);
                    setSelected(null);
                  }
                }}
                disabled={current === 0}
                className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              {current < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  disabled={selected === null}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={restart}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                >
                  <RotateCcw className="h-4 w-4" />
                  Finish Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </SectionPage>
  );
}