import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-3xl font-bold text-white">{title}</h1>

      <p className="mt-2 text-zinc-400">{subtitle}</p>

      <div className="mt-8">{children}</div>
    </div>
  );
}