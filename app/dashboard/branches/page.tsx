"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBranches, deleteBranch } from "@/services/branch";
import { getCourses } from "@/services/course";

type Branch = {
  id: string;
  courseId: string;
  name: string;
  code: string;
  description?: string;
};

type Course = {
  id: string;
  name: string;
  code: string;
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const [branchData, courseData] = await Promise.all([
        getBranches(),
        getCourses(),
      ]);

      setBranches(branchData as Branch[]);
      setCourses(courseData as Course[]);
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
    return courses.find((course) => course.id === courseId);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this branch?"
    );

    if (!confirmed) return;

    try {
      await deleteBranch(id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete branch");
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
              Branches
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage engineering and academic branches.
            </p>
          </div>

          <Link
            href="/dashboard/branches/add"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            + Add Branch
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
            Loading branches...
          </div>
        ) : branches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center">
            <h2 className="text-xl font-semibold">
              No branches yet
            </h2>

            <p className="mt-2 text-zinc-500">
              Add your first branch to continue building the academic structure.
            </p>

            <Link
              href="/dashboard/branches/add"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium"
            >
              Add Branch
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => {
              const course = getCourse(branch.courseId);

              return (
                <div
                  key={branch.id}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-blue-500/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      🎓
                    </div>

                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="text-sm text-zinc-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    {branch.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-blue-400">
                    {branch.code}
                  </p>

                  <div className="mt-5 rounded-xl bg-zinc-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Course
                    </p>

                    <p className="mt-1 font-medium text-zinc-200">
                      {course?.name || "Unknown Course"}
                    </p>
                  </div>

                  {branch.description && (
                    <p className="mt-4 line-clamp-3 text-sm text-zinc-500">
                      {branch.description}
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