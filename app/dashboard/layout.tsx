"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  NotebookPen,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { auth } from "@/firebase/firebase";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Universities",
    href: "/dashboard/universities",
    icon: Building2,
  },
  {
    name: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    name: "Branches",
    href: "/dashboard/branches",
    icon: Network,
  },
  {
    name: "Semesters",
    href: "/dashboard/semesters",
    icon: Layers3,
  },
  {
    name: "Subjects",
    href: "/dashboard/subjects",
    icon: NotebookPen,
  },
  {
    name: "Notes",
    href: "/dashboard/notes",
    icon: FileText,
  },
  {
    name: "PYQs",
    href: "/dashboard/pyqs",
    icon: FileText,
  },
  {
    name: "Exams",
    href: "/dashboard/exams",
    icon: CalendarDays,
  },
  {
    name: "MCQs",
    href: "/dashboard/mcqs",
    icon: GraduationCap,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    profile,
    loading,
    profileLoading,
    profileCompleted,
  } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
  console.log("DASHBOARD AUTH CHECK:", {
    user: user?.email,
    uid: user?.uid,
    loading,
    profileLoading,
    profileCompleted,
    profile
  });

  if (loading || profileLoading) return;

  if (!user) {
    router.replace("/login");
    return;
  }

  if (!profileCompleted) {
    router.replace("/onboarding");
  }
}, [
  user,
  loading,
  profileLoading,
  profileCompleted,
  profile,
  router,
  pathname,
]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
          <p className="mt-4 text-sm text-zinc-500">
            Checking your academic profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profileCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#09090b] lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-left"
            >
              <h1 className="text-2xl font-bold tracking-tight text-blue-500">
                SemShot
              </h1>

              <p className="mt-1 text-[11px] text-zinc-500">
                AI Exam Platform
              </p>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-blue-400"
                      }`}
                    />

                    <span>{item.name}</span>

                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold text-white">
                {profile?.name || user.displayName || "Student"}
              </p>

              <p className="mt-1 truncate text-[11px] text-zinc-500">
  {profile?.courseId || "Academic Profile"}
</p>

{profile?.branchId && (
  <p className="mt-1 truncate text-[11px] text-zinc-600">
    {profile.branchId}
  </p>
)}
              
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />

              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#09090b] transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <h1 className="text-2xl font-bold text-blue-500">
                  SemShot
                </h1>

                <p className="mt-1 text-[11px] text-zinc-500">
                  AI Exam Platform
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => router.push(item.href)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-300 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Dashboard
                </h2>

                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  Welcome back 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
                <span className="mr-2 text-xs text-zinc-600">
                  Search...
                </span>
              </div>

              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-400 transition hover:text-white"
              >
                <Bell className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/settings")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-blue-400 transition hover:border-blue-500/40"
              >
                {(
                  profile?.name ||
                  user.displayName ||
                  user.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </button>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}