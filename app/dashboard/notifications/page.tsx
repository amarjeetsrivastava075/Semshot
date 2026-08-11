"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
        <Bell />
      </div>

      <h1 className="text-3xl font-bold text-white">
        Notifications
      </h1>

      <p className="text-zinc-400">
        Your exam reminders and notifications will appear here.
      </p>
    </div>
  );
}