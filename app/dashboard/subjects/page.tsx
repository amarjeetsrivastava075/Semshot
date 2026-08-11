"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteSubject,
  getSubjects,
} from "@/services/subjects";
import { getCourses } from "@/services/course";
import { getBranches } from "@/services/branch";
import { getSemesters } from "@/services/semester";

type Subject = {
  id: string;
  courseId: string;
  branchId: string;
  semesterId: string;
  name: string;
  code: string;
  credits: number;
  units: string[];
  description?: string;
};

type Course = {
  id: string;
  name: string;
  code?: string;
};

type Branch = {
  id: string;
  name: string;
  code?: string;
};

type Semester = {
  id: string;
  name: string;
  number?: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const [
        subjectData,
        courseData,
        branchData,
        semesterData,
      ] = await Promise.all([
        getSubjects(),
        getCourses(),
        getBranches(),
        getSemesters(),
      ]);

      setSubjects(subjectData as Subject[]);
      setCourses(courseData as Course[]);
      setBranches(branchData as Branch[]);
      setSemesters(semesterData as Semester[]);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getCourse(id: string) {
    return courses.find((item) => item.id === id);
  }

  function getBranch(id: string) {
    return branches.find((item) => item.id === id);
  }

  function getSemester(id: string) {
    return semesters.find((item) => item.id === id);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteSubject(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredSubjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return subjects;
    }

    return subjects.filter((subject) => {
      const course = getCourse(subject.courseId);
      const branch = getBranch(subject.branchId);
      const semester = getSemester(subject.semesterId);

      return (
        subject.name.toLowerCase().includes(value) ||
        subject.code.toLowerCase().includes(value) ||
        course?.name?.toLowerCase().includes(value) ||
        branch?.name?.toLowerCase().includes(value) ||
        semester?.name?.toLowerCase().includes(value) ||
        subject.units.some((unit) =>
          unit.toLowerCase().includes(value)
        )
      );
    });
  }, [subjects, courses, branches, semesters, search]);

  const totalUnits = subjects.reduce(
    (total, subject) => total + subject.units.length,
    0
  );

  const averageUnits =
    subjects.length > 0
      ? Math.round(totalUnits / subjects.length)
      : 0;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-[#0b0b0e] to-violet-950/20 p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                Academic Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Subjects
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Manage subjects, official syllabus units and
                AI-powered preparation for every course and
                semester.
              </p>
            </div>

            <Link
              href="/dashboard/subjects/add"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              <Plus className="h-5 w-5" />
              Add Subject
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#101012] p-5 transition hover:border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Total Subjects
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {subjects.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101012] p-5 transition hover:border-purple-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Total Units
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalUnits}
                </p>
              </div>

              <div className="rounded-xl bg-purple-500/10 p-3">
                <Layers3 className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101012] p-5 transition hover:border-cyan-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Courses
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {courses.length}
                </p>
              </div>

              <div className="rounded-xl bg-cyan-500/10 p-3">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101012] p-5 transition hover:border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Avg. Units / Subject
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {averageUnits}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject, code, course, branch, semester or unit..."
              className="w-full rounded-2xl border border-white/10 bg-[#101012] py-4 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <section className="mt-7">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[390px] animate-pulse rounded-2xl border border-white/10 bg-[#101012]"
                />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-[#0b0b0d] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                No subjects yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Add your first subject and enter its official
                syllabus. The syllabus will later power
                SemShot's AI-generated exams.
              </p>

              <Link
                href="/dashboard/subjects/add"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                <Plus className="h-4 w-4" />
                Add First Subject
              </Link>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#101012] px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-zinc-700" />

              <h2 className="mt-5 text-lg font-semibold">
                No matching subjects
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Try searching with a different subject name,
                code or syllabus topic.
              </p>

              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredSubjects.map((subject) => {
                const course = getCourse(subject.courseId);
                const branch = getBranch(subject.branchId);
                const semester = getSemester(subject.semesterId);

                return (
                  <article
                    key={subject.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101012] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl transition group-hover:bg-blue-600/15" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/10 bg-blue-500/10">
                          <BookOpen className="h-6 w-6 text-blue-400" />
                        </div>

                        <button
                          onClick={() =>
                            subject.id &&
                            handleDelete(subject.id)
                          }
                          disabled={
                            deletingId === subject.id
                          }
                          className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                          title="Delete subject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                          {subject.code}
                        </p>

                        <h2 className="mt-1 line-clamp-2 min-h-[56px] text-xl font-bold tracking-tight text-white">
                          {subject.name}
                        </h2>
                      </div>

                      <div className="mt-5 space-y-2.5">
                        <div className="flex items-start gap-2 text-sm">
                          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />

                          <div className="min-w-0">
                            <p className="text-xs text-zinc-600">
                              Course
                            </p>

                            <p className="truncate text-zinc-300">
                              {course?.name || "Unknown Course"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />

                          <div className="min-w-0">
                            <p className="text-xs text-zinc-600">
                              Branch
                            </p>

                            <p className="truncate text-zinc-300">
                              {branch?.name || "Unknown Branch"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />

                          <div>
                            <p className="text-xs text-zinc-600">
                              Semester
                            </p>

                            <p className="text-zinc-300">
                              {semester?.name || "Unknown Semester"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                        <div>
                          <p className="text-xs text-zinc-600">
                            Credits
                          </p>

                          <p className="mt-0.5 font-semibold text-zinc-300">
                            {subject.credits}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-600">
                            Syllabus
                          </p>

                          <p className="mt-0.5 font-semibold text-zinc-300">
                            {subject.units.length} Units
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                          Syllabus
                        </p>

                        <div className="flex max-h-24 flex-wrap gap-2 overflow-hidden">
                          {subject.units.map(
                            (unit, index) => (
                              <span
                                key={index}
                                className="rounded-lg border border-white/5 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400"
                              >
                                U{index + 1}: {unit}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-white/5 pt-5">
                        <Link
                          href={`/dashboard/subjects/${subject.id}`}
                          className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-blue-500/30 hover:bg-zinc-900 hover:text-white"
                        >
                          View Subject
                          <ChevronRight className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/dashboard/exams/add?subjectId=${subject.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                          <Brain className="h-4 w-4" />
                          Generate AI Exam
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {!loading && filteredSubjects.length > 0 && (
          <div className="mt-7 flex flex-col gap-2 border-t border-white/5 pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredSubjects.length} of{" "}
              {subjects.length} subjects
            </p>

            <p className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              AI exams use your saved syllabus
            </p>
          </div>
        )}
      </div>
    </main>
  );
}