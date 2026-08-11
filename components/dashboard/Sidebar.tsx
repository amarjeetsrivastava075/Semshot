"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  GitBranch,
  Layers,
  Library,
  FileText,
  ClipboardList,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Universities",
    href: "/dashboard/universities",
    icon: GraduationCap,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Branches",
    href: "/dashboard/branches",
    icon: GitBranch,
  },
  {
    title: "Semesters",
    href: "/dashboard/semesters",
    icon: Layers,
  },
  {
    title: "Subjects",
    href: "/dashboard/subjects",
    icon: Library,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: FileText,
  },
  {
    title: "PYQs",
    href: "/dashboard/pyqs",
    icon: ClipboardList,
  },
  {
    title: "Exams",
    href: "/dashboard/exams",
    icon: GraduationCap,
  },
  {
    title: "MCQs",
    href: "/dashboard/mcqs",
    icon: Brain,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
  className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 lg:translate-x-0 ${
    mobileOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        <div className="flex h-24 items-center justify-between border-b border-zinc-800 px-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
          >
            <h1 className="text-3xl font-bold tracking-tight text-blue-500">
              SemShot
            </h1>

            <p className="mt-1 text-xs text-zinc-500">
              AI Exam Platform
            </p>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active
                      ? "text-white"
                      : "text-zinc-500 group-hover:text-white"
                  }`}
                />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="mb-3 rounded-xl bg-zinc-900 p-4">
            <p className="text-sm font-medium text-white">
              SemShot
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Prepare smarter. Score better.
            </p>
          </div>

          <button
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}