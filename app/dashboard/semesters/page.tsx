"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSemesters,
  deleteSemester,
} from "@/services/semester";
import { getCourses } from "@/services/course";
import { getBranches } from "@/services/branch";

type Semester = {
  id: string;
  courseId: string;
  branchId: string;
  name: string;
  number: number;
  description?: string;
};

type Course = {
  id: string;
  name: string;
};

type Branch = {
  id: string;
  name: string;
};

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const [semesterData, courseData, branchData] =
        await Promise.all([
          getSemesters(),
          getCourses(),
          getBranches(),
        ]);

      setSemesters(semesterData as Semester[]);
      setCourses(courseData as Course[]);
      setBranches(branchData as Branch[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getCourse(courseId: string) {
    return courses.find(
      (course) => course.id === courseId
    );
  }

  function getBranch(branchId: string) {
    return branches.find(
      (branch) => branch.id === branchId
    );
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this semester?"
    );

    if (!confirmed) return;

    try {
      await deleteSemester(id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete semester");
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-blue-400">
              Academic Management
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Semesters
            </h1>

            <p className="mt-2 text-zinc-400">
              Organize subjects semester-wise.
            </p>
          </div>

          <Link
            href="/dashboard/semesters/add"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            + Add Semester
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">
              Total Semesters
            </p>

            <p className="mt-2 text-3xl font-bold">
              {semesters.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">
              Courses
            </p>

            <p className="mt-2 text-3xl font-bold">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">
              Branches
            </p>

            <p className="mt-2 text-3xl font-bold">
              {branches.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-400">
            Loading semesters...
          </div>
        ) : semesters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              📚
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No semesters yet
            </h2>

            <p className="mt-2 text-zinc-500">
              Add semesters to start building your academic structure.
            </p>

            <Link
              href="/dashboard/semesters/add"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium"
            >
              Add Semester
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {semesters.map((semester) => {
              const course = getCourse(
                semester.courseId
              );

              const branch = getBranch(
                semester.branchId
              );

              return (
                <div
                  key={semester.id}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                      📖
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(semester.id)
                      }
                      className="text-sm text-zinc-600 transition hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Semester {semester.number}
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {semester.name}
                  </h2>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Course
                      </p>

                      <p className="text-sm text-zinc-300">
                        {course?.name || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600">
                        Branch
                      </p>

                      <p className="text-sm text-zinc-300">
                        {branch?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {semester.description && (
                    <p className="mt-4 line-clamp-2 text-sm text-zinc-500">
                      {semester.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}