"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addCourse } from "@/services/course";
import { getUniversities } from "@/services/getUniversities";

type University = {
  id?: string;
  name: string;
  shortName: string;
};

export default function CourseForm() {
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [universityId, setUniversityId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("4 Years");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await getUniversities();

        const formatted: University[] = data.map((item: any) => ({
          id: item.id,
          name: item.name || "",
          shortName: item.shortName || "",
        }));

        setUniversities(formatted);
      } catch (error) {
        console.error("Failed to load universities:", error);
      }
    };

    loadUniversities();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!universityId) {
      alert("Please select a university");
      return;
    }

    if (!name.trim()) {
      alert("Please enter course name");
      return;
    }

    if (!code.trim()) {
      alert("Please enter course code");
      return;
    }

    try {
      setLoading(true);

      await addCourse({
        universityId,
        name: name.trim(),
        code: code.trim(),
        duration,
        description: description.trim(),
      });

      alert("Course added successfully");

      router.push("/dashboard/courses");
      router.refresh();
    } catch (error) {
      console.error("Course save error:", error);
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          University
        </label>

        <select
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        >
          <option value="">Select University</option>

          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
              {university.shortName
                ? ` (${university.shortName})`
                : ""}
            </option>
          ))}
        </select>

        {universities.length === 0 && (
          <p className="mt-2 text-xs text-amber-400">
            No universities found. Add a university first.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Course Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="B.Tech Computer Science & Engineering"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Course Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="BTECH-CSE"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
          >
            <option value="2 Years">2 Years</option>
            <option value="3 Years">3 Years</option>
            <option value="4 Years">4 Years</option>
            <option value="5 Years">5 Years</option>
            <option value="6 Years">6 Years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this course..."
          rows={5}
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-800 px-6 py-3 font-medium text-zinc-300 transition hover:bg-zinc-900"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving Course..." : "Save Course"}
        </button>
      </div>
    </form>
  );
}