"use client";

import { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950/60 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
        {icon}
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {description}
      </p>

      {action && (
        <button
          onClick={onAction}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          {action}
        </button>
      )}
    </div>
  );
}