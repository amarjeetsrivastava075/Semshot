"use client";

import {
  CalendarDays,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SectionPage from "@/components/dashboard/SectionPage";

export default function ExamsPage() {
  const router = useRouter();

  return (
    <SectionPage
      title="Exams"
      description="Prepare for MST, End Semester and other university examinations."
      icon={<CalendarDays className="h-6 w-6" />}
      action="+ Create Exam"
      onAction={() => router.push("/dashboard/exams/add")}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="group rounded-3xl border border-zinc-800 bg-gradient-to-br from-blue-600/10 to-zinc-950 p-6 transition hover:border-blue-500/50">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
              <Trophy className="h-6 w-6" />
            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              MST
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            Mid Semester Test
          </h2>

          <p className="mt-2 text-zinc-400">
            20 marks · Unit-based preparation
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Questions
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                7
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Marks
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                20
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/dashboard/exams/add?mode=mst");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Start Preparation
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="group rounded-3xl border border-zinc-800 bg-gradient-to-br from-purple-600/10 to-zinc-950 p-6 transition hover:border-purple-500/50">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400">
              <CalendarDays className="h-6 w-6" />
            </div>

            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
              END SEM
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            End Semester
          </h2>

          <p className="mt-2 text-zinc-400">
            50 marks · Complete syllabus preparation
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Units
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                5
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                Marks
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                50
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/dashboard/exams/add?mode=end-sem");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-500"
          >
            Start Preparation
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SectionPage>
  );
}