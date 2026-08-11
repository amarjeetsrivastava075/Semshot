"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
        <BarChart3 />
      </div>

      <h1 className="text-3xl font-bold text-white">
        Analytics
      </h1>

      <p className="text-zinc-400">
        Your preparation analytics will appear here.
      </p>
    </div>
  );
}