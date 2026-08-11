import SubjectForm from "@/components/subject/SubjectForm";

export default function AddSubjectPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Academic Management
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Add Subject
          </h1>

          <p className="mt-2 text-zinc-400">
            Add a subject and its complete syllabus structure.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <SubjectForm />
        </div>
      </div>
    </main>
  );
}