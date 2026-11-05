"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addSubject } from "@/services/subjects";
import { getCourses } from "@/services/course";
import { getBranches } from "@/services/branch";
import { getSemesters } from "@/services/semester";
import useAuth from "@/hooks/useAuth";

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

  const {
    user,
    profile,
    loading: authLoading,
    profileLoading,
    profileCompleted,
  } = useAuth();

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
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAcademicData() {
      try {
        if (!profile?.courseId || !profile?.branchId) {
          return;
        }

        const [courseData, branchData, semesterData] =
          await Promise.all([
            getCourses(),
            getBranches(profile.courseId),
            getSemesters(
              profile.courseId,
              profile.branchId
            ),
          ]);

        setCourses(courseData as Course[]);
        setBranches(branchData as Branch[]);
        setSemesters(
          semesterData as Semester[]
        );
      } catch (error) {
        console.error(
          "Failed to load academic data:",
          error
        );

        setError(
          "Failed to load academic information."
        );
      }
    }

    if (
      user &&
      profileCompleted &&
      profile
    ) {
      loadAcademicData();
    }
  }, [
    user,
    profile,
    profileCompleted,
  ]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    if (profile.courseId) {
      setCourseId(profile.courseId);
    }

    if (profile.branchId) {
      setBranchId(profile.branchId);
    }

    if (profile.semesterId) {
      setSemesterId(profile.semesterId);
    }
  }, [profile]);

  function updateUnit(
    index: number,
    value: string
  ) {
    setUnits((current) => {
      const updated = [...current];
      updated[index] = value;
      return updated;
    });
  }

  function addUnit() {
    setUnits((current) => [
      ...current,
      "",
    ]);
  }

  function removeUnit(index: number) {
    if (units.length <= 1) {
      return;
    }

    setUnits((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (authLoading || profileLoading) {
      setError(
        "Please wait while your academic profile loads."
      );
      return;
    }

    if (!user) {
      setError(
        "Please login before adding a subject."
      );
      return;
    }

    if (!profileCompleted || !profile) {
      setError(
        "Please complete your academic profile first."
      );
      return;
    }

    const finalUniversityId =
      profile.universityId;

    const finalCourseId =
      profile.courseId || courseId;

    const finalBranchId =
      profile.branchId || branchId;

    const finalSemesterId =
      profile.semesterId || semesterId;

    if (!finalUniversityId) {
      setError(
        "Your university is not selected."
      );
      return;
    }

    if (!finalCourseId) {
      setError(
        "Your course is not selected."
      );
      return;
    }

    if (!finalBranchId) {
      setError(
        "Your branch is not selected."
      );
      return;
    }

    if (!finalSemesterId) {
      setError(
        "Your semester is not selected."
      );
      return;
    }

    if (!name.trim()) {
      setError("Enter subject name.");
      return;
    }

    if (!code.trim()) {
      setError("Enter subject code.");
      return;
    }

    const validUnits = units
      .map((unit) => unit.trim())
      .filter(Boolean);

    if (validUnits.length === 0) {
      setError(
        "Add at least one syllabus unit."
      );
      return;
    }

    try {
      setLoading(true);

      await addSubject({
        universityId: finalUniversityId,
        courseId: finalCourseId,
        branchId: finalBranchId,
        semesterId: finalSemesterId,
        name: name.trim(),
        code: code.trim(),
        credits: Number(credits),
        units: validUnits,
        description: description.trim(),
      });

      alert(
        "Subject added successfully"
      );

      router.push(
        "/dashboard/subjects"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to add subject:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add subject."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedCourse = courses.find(
    (course) =>
      course.id === courseId
  );

  const selectedBranch = branches.find(
    (branch) =>
      branch.id === branchId
  );

  const selectedSemester =
    semesters.find(
      (semester) =>
        semester.id === semesterId
    );

  if (
    authLoading ||
    profileLoading
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-zinc-800 border-t-blue-500" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading your academic profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-red-400">
          Please login before adding a subject.
        </p>
      </div>
    );
  }

  if (!profileCompleted || !profile) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
        <p className="text-yellow-400">
          Please complete your academic profile
          before adding a subject.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/onboarding")
          }
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl space-y-7"
    >
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <span className="text-lg">
              🎓
            </span>
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Your Academic Profile
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              This subject will automatically be
              assigned to your selected academic
              profile.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-zinc-900/70 p-4">
            <p className="text-xs text-zinc-500">
              University
            </p>

            <p className="mt-1 font-medium text-white">
              {profile.universityId}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/70 p-4">
            <p className="text-xs text-zinc-500">
              Course
            </p>

            <p className="mt-1 font-medium text-white">
              {selectedCourse?.name ||
  profile.courseId}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/70 p-4">
            <p className="text-xs text-zinc-500">
              Branch
            </p>

            <p className="mt-1 font-medium text-white">
              {selectedBranch?.name ||
  profile.branchId}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/70 p-4">
            <p className="text-xs text-zinc-500">
              Semester
            </p>

            <p className="mt-1 font-medium text-white">
              {selectedSemester?.name ||
  profile.semesterId}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Course
          </label>

          <select
            value={courseId}
            disabled
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            <option value="">
              Select Course
            </option>

            {selectedCourse && (
              <option value={selectedCourse.id}>
                {selectedCourse.name}
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Branch
          </label>

          <select
            value={branchId}
            disabled
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            <option value="">
              Select Branch
            </option>

            {selectedBranch && (
              <option value={selectedBranch.id}>
                {selectedBranch.name}
              </option>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Semester
        </label>

        <select
          value={semesterId}
          disabled
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          <option value="">
            Select Semester
          </option>

          {selectedSemester && (
            <option value={selectedSemester.id}>
              {selectedSemester.name}
            </option>
          )}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Subject Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Database Management System"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
          />

          <p className="mt-2 text-xs text-zinc-600">
            You can enter the subject name normally.
            SemShot can understand common subject
            names for AI preparation.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Subject Code
          </label>

          <input
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
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
          onChange={(e) =>
            setCredits(e.target.value)
          }
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="1">
            1 Credit
          </option>

          <option value="2">
            2 Credits
          </option>

          <option value="3">
            3 Credits
          </option>

          <option value="4">
            4 Credits
          </option>

          <option value="5">
            5 Credits
          </option>

          <option value="6">
            6 Credits
          </option>
        </select>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Syllabus Units
            </h2>

            <p className="text-sm text-zinc-500">
              Add topics that AI will use for
              question generation.
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
          {units.map(
            (unit, index) => (
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
                    updateUnit(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Unit ${
                    index + 1
                  } topic`}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500"
                />

                {units.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeUnit(index)
                    }
                    className="rounded-xl border border-zinc-800 px-4 text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          )}
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

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          disabled={loading}
          className="rounded-xl border border-zinc-800 px-6 py-3 text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            !profile.universityId ||
            !courseId ||
            !branchId ||
            !semesterId
          }
          className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Add Subject"}
        </button>
      </div>
    </form>
  );
}