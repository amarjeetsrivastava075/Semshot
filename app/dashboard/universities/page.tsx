import Link from "next/link";

import { getUniversities } from "@/services/getUniversities";
import UniversityCard from "@/components/university/UniversityCard";

export default async function UniversitiesPage() {

  const universities = await getUniversities();

  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Universities
          </h1>

          <p className="text-zinc-400">
            Total : {universities.length}
          </p>

        </div>

        <Link
          href="/dashboard/universities/add"
          className="rounded-xl bg-blue-600 px-5 py-3"
        >
          + Add University
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {universities.map((university: any) => (

          <UniversityCard
            key={university.id}
            university={university}
          />

        ))}

      </div>

    </div>
  );
}