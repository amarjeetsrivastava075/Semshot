import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar />

      <div className="min-h-screen lg:pl-64">
        <Topbar />

        <main className="min-h-[calc(100vh-80px)] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}