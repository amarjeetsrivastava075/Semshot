"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUniversity } from "@/services/addUniversities";


export default function UniversityForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  async function handleSave() {
    if (
      !name ||
      !shortName ||
      !country ||
      !state ||
      !city
    ) {
      alert("Please fill all fields");
      return;
    }

    await addUniversity({
      name,
      shortName,
      country,
      state,
      city,
    });

    router.push("/dashboard/universities");
  }

  return (
    <div className="space-y-6">

      <input
        placeholder="University Name"
        className="w-full rounded-lg bg-zinc-900 p-4 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Short Name"
        className="w-full rounded-lg bg-zinc-900 p-4 text-white"
        value={shortName}
        onChange={(e) => setShortName(e.target.value)}
      />

      <input
        placeholder="Country"
        className="w-full rounded-lg bg-zinc-900 p-4 text-white"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <input
        placeholder="State"
        className="w-full rounded-lg bg-zinc-900 p-4 text-white"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      <input
        placeholder="City"
        className="w-full rounded-lg bg-zinc-900 p-4 text-white"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="rounded-lg bg-blue-600 px-8 py-4 text-white hover:bg-blue-700 transition"
      >
        Save University
      </button>

    </div>
  );
}