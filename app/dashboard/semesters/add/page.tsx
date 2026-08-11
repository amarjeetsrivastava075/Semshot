import SemesterForm from "@/components/semester/SemesterForm";

export default function AddSemesterPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Academic Management
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Add Semester
          </h1>

          <p className="mt-2 text-zinc-400">
            Create a semester under a specific branch.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <SemesterForm />
        </div>
      </div>
    </main>
  );
}