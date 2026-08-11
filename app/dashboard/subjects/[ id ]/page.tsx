"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Play,
  Sparkles,
} from "lucide-react";
import { getSubjectById } from "@/services/subjects";

type Subject = {
  id: string;
  name: string;
  code: string;
  credits: number;
  units: string[];
  description: string;
};

export default function SubjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubject() {
      try {
        const id = String(params.id);
        const data = await getSubjectById(id);

        setSubject(data as Subject | null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-48 animate-pulse rounded-3xl bg-zinc-900" />
        </div>
      </main>
    );
  }

  if (!subject) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-2xl font-bold">
            Subject not found
          </h1>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </button>

        <section className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-gradient-to-br from-blue-950/40 via-zinc-950 to-violet-950/30 p-7 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                  <BookOpen className="h-7 w-7 text-blue-400" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  {subject.code}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
                  {subject.name}
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  {subject.description ||
                    "Prepare for this subject with syllabus-based AI practice and exams."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs text-zinc-500">
                  Credits
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {subject.credits}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/exams/add?subjectId=${subject.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
              >
                <Sparkles className="h-4 w-4" />
                Generate AI Exam
              </Link>

              <button
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                <FileText className="h-4 w-4" />
                Study Notes
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-medium text-blue-400">
              Official Syllabus
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Units & Topics
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              AI exams will be generated using these syllabus topics.
            </p>
          </div>

          <div className="space-y-4">
            {subject.units.map((unit, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-blue-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">
                    U{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Unit {index + 1}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {unit}
                    </h3>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-zinc-700 transition group-hover:text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 pb-10 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <Brain className="h-6 w-6 text-blue-400" />

            <h3 className="mt-4 font-semibold">
              AI Practice
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Generate questions from the selected syllabus.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <Play className="h-6 w-6 text-purple-400" />

            <h3 className="mt-4 font-semibold">
              Mock Tests
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Take timed tests and evaluate your preparation.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <CheckCircle2 className="h-6 w-6 text-green-400" />

            <h3 className="mt-4 font-semibold">
              Performance
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Track accuracy, scores and weak topics.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}