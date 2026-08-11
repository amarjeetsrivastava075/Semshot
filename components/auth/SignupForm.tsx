"use client";

import Link from "next/link";

export default function SignupForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

        <h1 className="mb-2 text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="mb-8 text-zinc-400">
          Welcome to SemShot
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none"
        />

        <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
          Create Account
        </button>

        <p className="mt-6 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}