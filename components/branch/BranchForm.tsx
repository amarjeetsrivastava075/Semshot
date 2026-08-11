"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addBranch } from "@/services/branch";
import { getCourses } from "@/services/course";

type Course = {
  id: string;
  name: string;
  code: string;
};

export default function BranchForm() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();

        setCourses(
          data.map((item: any) => ({
            id: item.id,
            name: item.name || "",
            code: item.code || "",
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadCourses();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!courseId) {
      alert("Select a course");
      return;
    }

    if (!name.trim()) {
      alert("Enter branch name");
      return;
    }

    if (!code.trim()) {
      alert("Enter branch code");
      return;
    }

    try {
      setLoading(true);

      await addBranch({
        courseId,
        name: name.trim(),
        code: code.trim(),
        description: description.trim(),
      });

      alert("Branch added successfully");

      router.push("/dashboard/branches");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add branch");
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
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Branch Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Computer Science & Engineering"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Branch Code
        </label>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CSE"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Computer Science and Engineering"
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-800 px-6 py-3 text-zinc-300 hover:bg-zinc-900"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Branch"}
        </button>
      </div>
    </form>
  );
}