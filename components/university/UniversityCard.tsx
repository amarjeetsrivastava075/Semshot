type Props = {
  university: any;
};

export default function UniversityCard({
  university,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold">
        {university.name}
      </h2>

      <p className="text-zinc-400">
        {university.shortName}
      </p>

      <div className="mt-4">

        <p>{university.city}</p>

        <p>{university.state}</p>

        <p>{university.country}</p>

      </div>

    </div>
  );
}