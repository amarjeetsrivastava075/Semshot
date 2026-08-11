import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-blue-500">SemShot</h1>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-5 py-2 hover:bg-zinc-900"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-28 text-center">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
          AI Powered Exam Preparation
        </span>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight">
          Study Smarter,
          <br />
          Score Better.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          One platform for Notes, PYQs, MCQs, AI Summaries and Exam Preparation
          for every university.
        </p>

        <div className="mt-10 flex gap-5">
          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold hover:bg-blue-700"
          >
            Start Learning
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-zinc-700 px-8 py-4 text-lg hover:bg-zinc-900"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}