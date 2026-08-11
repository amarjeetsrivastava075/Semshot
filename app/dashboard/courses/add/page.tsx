import CourseForm from "@/components/course/CourseForm";

export default function AddCoursePage() {
  return (
    <div className="min-h-screen px-5 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Academic Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Add Course
          </h1>

          <p className="mt-2 text-zinc-400">
            Create a course and connect it with a university.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-8">
          <CourseForm />
        </div>
      </div>
    </div>
  );
}