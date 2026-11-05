"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDocs, collection, setDoc } from "firebase/firestore";
import { Check, ChevronRight, GraduationCap, Loader2 } from "lucide-react";
import { db } from "@/firebase/firebase";
import useAuth from "@/hooks/useAuth";

type Item = {
  id: string;
  name?: string;
  title?: string;
  shortName?: string;
  code?: string;
  universityId?: string;
  courseId?: string;
  branchId?: string;
  semesterNumber?: number;
  number?: number;
  semester?: number;
};

export default function OnboardingPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
    profileLoading,
    profileCompleted,
  } = useAuth();

  const [universities, setUniversities] = useState<Item[]>([]);
  const [courses, setCourses] = useState<Item[]>([]);
  const [branches, setBranches] = useState<Item[]>([]);
  const [semesters, setSemesters] = useState<Item[]>([]);

  const [universityId, setUniversityId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!profileLoading && profileCompleted) {
      router.replace("/dashboard");
    }
  }, [profileLoading, profileCompleted, router]);

  useEffect(() => {
    async function loadAcademicData() {
      try {
        setLoadingData(true);
        setError("");

        const [
          universitiesSnapshot,
          coursesSnapshot,
          branchesSnapshot,
          semestersSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "universities")),
          getDocs(collection(db, "courses")),
          getDocs(collection(db, "branches")),
          getDocs(collection(db, "semesters")),
        ]);

        const universityData = universitiesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Item[];

        const courseData = coursesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Item[];

        const branchData = branchesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Item[];

        const semesterData = semestersSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Item[];

        setUniversities(universityData);
        setCourses(courseData);
        setBranches(branchData);
        setSemesters(semesterData);
      } catch (err) {
        console.error("Failed to load academic data:", err);
        setError("Unable to load academic details. Please try again.");
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      loadAcademicData();
    }
  }, [user]);

  const filteredCourses = useMemo(() => {
    if (!universityId) return [];

    return courses.filter((course) => {
      return (
        course.universityId === universityId ||
        course.universityId === undefined ||
        course.universityId === null
      );
    });
  }, [courses, universityId]);

  const filteredBranches = useMemo(() => {
    if (!courseId) return [];

    return branches.filter((branch) => {
      return (
        branch.courseId === courseId ||
        branch.courseId === undefined ||
        branch.courseId === null
      );
    });
  }, [branches, courseId]);

  const filteredSemesters = useMemo(() => {
    if (!branchId) return [];

    return semesters.filter((semester) => {
      return (
        semester.branchId === branchId ||
        semester.branchId === undefined ||
        semester.branchId === null
      );
    });
  }, [semesters, branchId]);

  function getDisplayName(item: Item) {
    return item.name || item.title || item.shortName || item.code || item.id;
  }

  function getSemesterName(item: Item) {
    const number =
      item.semesterNumber ?? item.number ?? item.semester;

    if (number !== undefined) {
      return `Semester ${number}`;
    }

    return item.name || item.title || item.id;
  }

  function handleUniversityChange(value: string) {
    setUniversityId(value);
    setCourseId("");
    setBranchId("");
    setSemesterId("");
  }

  function handleCourseChange(value: string) {
    setCourseId(value);
    setBranchId("");
    setSemesterId("");
  }

  function handleBranchChange(value: string) {
    setBranchId(value);
    setSemesterId("");
  }

  async function saveProfile() {
    if (!user) return;

    if (!universityId || !courseId || !branchId || !semesterId) {
      setError("Please select University, Course, Branch and Semester.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const selectedUniversity = universities.find(
        (item) => item.id === universityId
      );

      const selectedCourse = courses.find(
        (item) => item.id === courseId
      );

      const selectedBranch = branches.find(
        (item) => item.id === branchId
      );

      const selectedSemester = semesters.find(
        (item) => item.id === semesterId
      );

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",

          universityId,
          universityName: selectedUniversity
            ? getDisplayName(selectedUniversity)
            : "",

          courseId,
          courseName: selectedCourse
            ? getDisplayName(selectedCourse)
            : "",

          branchId,
          branchName: selectedBranch
            ? getDisplayName(selectedBranch)
            : "",

          semesterId,
          semesterName: selectedSemester
            ? getSemesterName(selectedSemester)
            : "",

          profileCompleted: true,

          updatedAt: new Date(),
        },
        { merge: true }
      );

      router.replace("/dashboard");
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Unable to save your academic profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || profileLoading || loadingData) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-zinc-400">
            Preparing your academic profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="min-h-screen flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
              <GraduationCap className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-bold">
              Set up your academic profile
            </h1>

            <p className="mt-3 text-zinc-400">
              Tell SemShot what you study so we can show only
              the subjects and syllabus relevant to you.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

            <div className="mb-8 grid grid-cols-4 gap-2">
              <Step
                number={1}
                label="University"
                active={!!universityId}
              />
              <Step
                number={2}
                label="Course"
                active={!!courseId}
              />
              <Step
                number={3}
                label="Branch"
                active={!!branchId}
              />
              <Step
                number={4}
                label="Semester"
                active={!!semesterId}
              />
            </div>

            <div className="space-y-6">

              <SelectField
                label="University"
                value={universityId}
                onChange={handleUniversityChange}
                placeholder="Select your university"
                items={universities}
                getLabel={getDisplayName}
              />

              <SelectField
                label="Course"
                value={courseId}
                onChange={handleCourseChange}
                placeholder={
                  universityId
                    ? "Select your course"
                    : "Select university first"
                }
                items={filteredCourses}
                getLabel={getDisplayName}
                disabled={!universityId}
              />

              <SelectField
                label="Branch"
                value={branchId}
                onChange={handleBranchChange}
                placeholder={
                  courseId
                    ? "Select your branch"
                    : "Select course first"
                }
                items={filteredBranches}
                getLabel={getDisplayName}
                disabled={!courseId}
              />

              <SelectField
                label="Semester"
                value={semesterId}
                onChange={setSemesterId}
                placeholder={
                  branchId
                    ? "Select your semester"
                    : "Select branch first"
                }
                items={filteredSemesters}
                getLabel={getSemesterName}
                disabled={!branchId}
              />

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={saveProfile}
                disabled={
                  saving ||
                  !universityId ||
                  !courseId ||
                  !branchId ||
                  !semesterId
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>

            </div>
          </div>

          <p className="mt-5 text-center text-xs text-zinc-600">
            You can update your academic details later from Settings.
          </p>
        </div>
      </div>
    </main>
  );
}

function Step({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
          active
            ? "border-blue-500 bg-blue-600 text-white"
            : "border-zinc-700 bg-zinc-900 text-zinc-500"
        }`}
      >
        {active ? (
          <Check className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <p
        className={`mt-2 hidden text-[11px] sm:block ${
          active ? "text-blue-400" : "text-zinc-600"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  items,
  getLabel,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  items: Item[];
  getLabel: (item: Item) => string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <option value="">{placeholder}</option>

        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {getLabel(item)}
            {item.code ? ` (${item.code})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}