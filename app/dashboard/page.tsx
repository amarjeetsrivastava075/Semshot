"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers3,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Universities",
    value: "0",
    icon: GraduationCap,
    href: "/dashboard/universities",
  },
  {
    title: "Courses",
    value: "0",
    icon: BookOpen,
    href: "/dashboard/courses",
  },
  {
    title: "Subjects",
    value: "0",
    icon: Layers3,
    href: "/dashboard/subjects",
  },
  {
    title: "Notes",
    value: "0",
    icon: FileText,
    href: "/dashboard/notes",
  },
];

const features = [
  {
    title: "AI Question Generator",
    description:
      "Generate fresh exam questions automatically using AI for any subject and unit.",
    icon: Brain,
    href: "/dashboard/exams",
  },
  {
    title: "Smart Practice",
    description:
      "Practice MCQs and topic-wise questions based on your course and syllabus.",
    icon: Target,
    href: "/dashboard/mcqs",
  },
  {
    title: "Mock Exams",
    description:
      "Attempt timed examinations and get instant results with detailed analysis.",
    icon: ClipboardCheck,
    href: "/dashboard/exams",
  },
];

type ExamResult = {
  id: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  mode: string;
  date: string;
};

export default function DashboardPage() {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem("semshot_exam_results");

      if (!savedResults) {
        setExamResults([]);
        return;
      }

      const parsedResults = JSON.parse(savedResults);

      if (Array.isArray(parsedResults)) {
        setExamResults(parsedResults);
      } else {
        setExamResults([]);
      }
    } catch (error) {
      console.error("Failed to load exam results:", error);
      setExamResults([]);
    }
  }, []);

  const averageScore =
    examResults.length > 0
      ? Math.round(
          examResults.reduce(
            (total, result) => total + Number(result.percentage || 0),
            0
          ) / examResults.length
        )
      : 0;

  const latestResult = examResults.length > 0 ? examResults[0] : null;

  return (
    <div className="min-h-full overflow-hidden bg-[#050505]">
      <section className="relative mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="pointer-events-none absolute right-0 top-[280px] h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/50 via-[#0b0b12] to-violet-950/30 p-7 shadow-2xl sm:p-10 lg:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/10 animate-pulse" />

          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-violet-400/10" />

          <div className="relative max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles className="h-4 w-4" />
              AI Powered Exam Preparation
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Prepare Smarter.
              <br />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Score Better.
              </span>

              <span className="ml-3 inline-block animate-bounce">
                🚀
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              SemShot brings your courses, subjects, notes, PYQs, MCQs and
              AI-generated exams into one powerful preparation platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard/subjects"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Explore Subjects

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/exams"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <Zap className="h-4 w-4 text-yellow-400" />
                Start AI Exam
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 right-10 hidden lg:block">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/5 shadow-[0_0_80px_rgba(59,130,246,0.15)]">
              <Brain className="h-14 w-14 text-blue-400 animate-pulse" />

              <div className="absolute inset-3 rounded-full border border-dashed border-blue-400/20 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111113] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-[#15151a]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-300 group-hover:bg-blue-500/15" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-4xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-3">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                </div>

                <div className="relative mt-5 flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors group-hover:text-blue-400">
                  Open section

                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">
                SEMshot AI
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Everything you need to prepare
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101012] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-violet-500/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-violet-500/5" />

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-all group-hover:border-blue-400/30 group-hover:text-blue-400">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {feature.description}
                    </p>

                    <div className="mt-6 h-1 w-12 rounded-full bg-blue-500 transition-all duration-500 group-hover:w-24" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 pb-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#101012] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-yellow-500/10 p-3">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Your Progress
                </h3>

                <p className="text-sm text-zinc-500">
                  {examResults.length > 0
                    ? `${examResults.length} exam${
                        examResults.length > 1 ? "s" : ""
                      } attempted`
                    : "Start an exam to track your performance."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">
                  Average Score
                </p>

                <p className="mt-1 text-4xl font-bold text-white">
                  {averageScore}%
                </p>
              </div>

              {latestResult && (
                <div className="text-right">
                  <p className="text-xs text-zinc-500">
                    Latest
                  </p>

                  <p className="mt-1 max-w-[180px] truncate text-sm font-medium text-blue-400">
                    {latestResult.subject}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {latestResult.percentage}%
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                style={{
                  width: `${Math.min(Math.max(averageScore, 0), 100)}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-zinc-600">
              {examResults.length > 0
                ? `Best recent result: ${latestResult?.percentage || 0}%`
                : "No exams attempted yet"}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/30 to-violet-950/20 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  AI Exam Engine
                </h3>

                <p className="text-sm text-zinc-500">
                  Generate questions from your selected syllabus.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/exams"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Generate an exam

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}