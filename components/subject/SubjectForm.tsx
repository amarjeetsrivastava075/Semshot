"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addSubject } from "@/services/subjects";
import { getCourses } from "@/services/course";
import { getBranches } from "@/services/branch";
import { getSemesters } from "@/services/semester";

type Course = {
  id: string;
  name: string;
};

type Branch = {
  id: string;
  courseId: string;
  name: string;
};

type Semester = {
  id: string;
  courseId: string;
  branchId: string;
  name: string;
  number: number;
};

export default function SubjectForm() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("4");
  const [description, setDescription] = useState("");

  const [units, setUnits] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

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
        setSemesters([]);
        setSemesterId("");
        return;
      }

      try {
        const data = await getBranches(courseId);
        setBranches(data as Branch[]);
        setBranchId("");
        setSemesters([]);
        setSemesterId("");
      } catch (error) {
        console.error(error);
      }
    }

    loadBranches();
  }, [courseId]);

  useEffect(() => {
    async function loadSemesters() {
      if (!branchId) {
        setSemesters([]);
        setSemesterId("");
        return;
      }

      try {
        const data = await getSemesters(
          courseId,
          branchId
        );

        setSemesters(data as Semester[]);
        setSemesterId("");
      } catch (error) {
        console.error(error);
      }
    }

    loadSemesters();
  }, [branchId, courseId]);

  function updateUnit(index: number, value: string) {
    setUnits((current) => {
      const updated = [...current];
      updated[index] = value;
      return updated;
    });
  }

  function addUnit() {
    setUnits((current) => [...current, ""]);
  }

  function removeUnit(index: number) {
    if (units.length <= 1) return;

    setUnits((current) =>
      current.filter((_, i) => i !== index)
    );
  }

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

    if (!semesterId) {
      alert("Select semester");
      return;
    }

    if (!name.trim()) {
      alert("Enter subject name");
      return;
    }

    if (!code.trim()) {
      alert("Enter subject code");
      return;
    }

    const validUnits = units
      .map((unit) => unit.trim())
      .filter(Boolean);

    if (validUnits.length === 0) {
      alert("Add at least one unit");
      return;
    }

    try {
      setLoading(true);

      await addSubject({
        courseId,
        branchId,
        semesterId,
        name: name.trim(),
        code: code.trim(),
        credits: Number(credits),
        units: validUnits,
        description: description.trim(),
      });

      alert("Subject added successfully");

      router.push("/dashboard/subjects");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add subject");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl space-y-7"
    >
      <div className="grid gap-5 md:grid-cols-2">
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
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">
              {courseId
                ? "Select Branch"
                : "Select course first"}
            </option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Semester
        </label>

        <select
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          disabled={!branchId}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
        >
          <option value="">
            {branchId
              ? "Select Semester"
              : "Select branch first"}
          </option>

          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Subject Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Database Management System"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Subject Code
          </label>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CSE-301"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Credits
        </label>

        <select
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="1">1 Credit</option>
          <option value="2">2 Credits</option>
          <option value="3">3 Credits</option>
          <option value="4">4 Credits</option>
          <option value="5">5 Credits</option>
          <option value="6">6 Credits</option>
        </select>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Syllabus Units
            </h2>

            <p className="text-sm text-zinc-500">
              Add topics that AI will use for question generation.
            </p>
          </div>

          <button
            type="button"
            onClick={addUnit}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500 hover:text-white"
          >
            + Add Unit
          </button>
        </div>

        <div className="space-y-3">
          {units.map((unit, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">
                U{index + 1}
              </div>

              <input
                value={unit}
                onChange={(e) =>
                  updateUnit(index, e.target.value)
                }
                placeholder={`Unit ${index + 1} topic`}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
              />

              {units.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUnit(index)}
                  className="rounded-xl border border-zinc-800 px-4 text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
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
          placeholder="Short description about this subject..."
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
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
          className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Subject"}
        </button>
      </div>
    </form>
  );
}