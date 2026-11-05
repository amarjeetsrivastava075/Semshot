"use client";

import { useState } from "react";
import { seedAcademicData } from "@/services/seedAcademicData";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    try {
      setLoading(true);
      setMessage("");

      await seedAcademicData();

      setMessage("Academic data seeded successfully!");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to seed academic data"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
        <h1 className="text-2xl font-bold">
          SemShot Academic Data
        </h1>

        <p className="mt-2 text-zinc-400">
          Create courses, branches and semesters in Firebase.
        </p>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Seed Academic Data"}
        </button>

        {message && (
          <p className="mt-5 rounded-xl bg-zinc-900 p-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}