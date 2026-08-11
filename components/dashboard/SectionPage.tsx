"use client";

import { ReactNode } from "react";

type SectionPageProps = {
  title: string;
  description: string;
  icon: ReactNode;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export default function SectionPage({
  title,
  description,
  icon,
  action,
  onAction,
  children,
}: SectionPageProps) {
  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
            {icon}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mt-2 text-zinc-400">
              {description}
            </p>
          </div>
        </div>

        {action && (
          <button
            onClick={onAction}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}