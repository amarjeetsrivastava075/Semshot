"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, GraduationCap, Plus, Trash2 } from "lucide-react";
import { getCourses, deleteCourse } from "@/services/course";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    await deleteCourse(id);
    await loadCourses();
  }

  return (
    <div className="min-h-screen px-5 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
              <BookOpen className="h-4 w-4" />
              Academic Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Courses
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage courses and build the academic structure for SemShot.
            </p>
          </div>

          <Link
            href="/dashboard/courses/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <GraduationCap className="mb-4 h-6 w-6 text-blue-400" />
            <p className="text-sm text-zinc-500">Total Courses</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <BookOpen className="mb-4 h-6 w-6 text-purple-400" />
            <p className="text-sm text-zinc-500">Academic Programs</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <Clock className="mb-4 h-6 w-6 text-cyan-400" />
            <p className="text-sm text-zinc-500">Active Structure</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {courses.length > 0 ? "Ready" : "Empty"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <GraduationCap className="h-8 w-8 text-blue-400" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              No courses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-zinc-500">
              Add your first course. After that you can create branches,
              semesters, subjects and AI exams.
            </p>

            <Link
              href="/dashboard/courses/add"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
            >
              <Plus className="h-5 w-5" />
              Add First Course
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl transition group-hover:bg-blue-600/20" />

                <div className="relative">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <GraduationCap className="h-6 w-6" />
                    </div>

                    {course.id && (
                      <button
                        onClick={() => handleDelete(course.id!)}
                        className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    {course.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-blue-400">
                    {course.code}
                  </p>

                  <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-6 text-zinc-500">
                    {course.description || "No description available."}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>

                  <div className="mt-6 border-t border-zinc-800 pt-5">
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                      Open Course →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}