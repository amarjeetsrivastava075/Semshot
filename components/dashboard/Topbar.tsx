"use client";

import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">

      <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-sm text-zinc-400">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-zinc-500"
          />

          <input
            placeholder="Search..."
            className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        <button className="rounded-xl bg-zinc-900 p-3 hover:bg-zinc-800">
          <Bell size={20} />
        </button>

        <button className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800">
          <UserCircle2 size={32} />
        </button>

      </div>

    </header>
  );
}