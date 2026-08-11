"use client";

import { Bell, Palette, Settings, Shield, User } from "lucide-react";
import SectionPage from "@/components/dashboard/SectionPage";

export default function SettingsPage() {
  return (
    <SectionPage
      title="Settings"
      description="Manage your SemShot account and preferences."
      icon={<Settings className="h-6 w-6" />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            icon: User,
            title: "Profile",
            description: "Manage your name and account details.",
          },
          {
            icon: Bell,
            title: "Notifications",
            description: "Configure reminders and exam alerts.",
          },
          {
            icon: Palette,
            title: "Appearance",
            description: "Customize your SemShot experience.",
          },
          {
            icon: Shield,
            title: "Security",
            description: "Manage authentication and account security.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left transition hover:border-blue-500/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </SectionPage>
  );
}