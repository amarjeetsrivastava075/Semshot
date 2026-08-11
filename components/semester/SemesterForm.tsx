"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addSemester } from "@/services/semester";
import { getCourses } from "@/services/course";
import { getBranches } from "@/services/branch";

type Course = {
  id: string;
  name: string;
  code?: string;
};

type Branch = {
  id: string;
  courseId: string;
  name: string;
  code?: string;
};

export default function SemesterForm() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(data as Course[]);
      } catch (error) {
        console.error(error);
      }
    }

    loadCourses();
  }, []);

  useEffect(() => {
    async function loadBranches() {
      if (!courseId) {
        setBranches([]);
        setBranchId("");
        return;
      }

      try {
        const data = await getBranches(courseId);
        setBranches(data as Branch[]);
        setBranchId("");
      } catch (error) {
        console.error(error);
      }
    }

    loadBranches();
  }, [courseId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!courseId) {
      alert("Select course");
      return;
    }

    if (!branchId) {
      alert("Select branch");
      return;
    }

    if (!number) {
      alert("Select semester");
      return;
    }

    try {
      setLoading(true);

      await addSemester({
        courseId,
        branchId,
        name: `Semester ${number}`,
        number: Number(number),
        description: description.trim(),
      });

      alert("Semester added successfully");

      router.push("/dashboard/semesters");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add semester");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Course
        </label>

        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
              {course.code ? ` (${course.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Branch
        </label>

        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          disabled={!courseId}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {courseId
              ? "Select Branch"
              : "Select course first"}
          </option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
              {branch.code ? ` (${branch.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Semester
        </label>

        <select
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="">Select Semester</option>

          {Array.from({ length: 8 }, (_, index) => {
            const semester = index + 1;

            return (
              <option
                key={semester}
                value={semester}
              >
                Semester {semester}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          placeholder="Academic semester description"
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-800 px-6 py-3 text-zinc-300 transition hover:bg-zinc-900"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Semester"}
        </button>
      </div>
    </form>
  );
}