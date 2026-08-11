"use client";

import { ClipboardList, Plus } from "lucide-react";
import SectionPage from "@/components/dashboard/SectionPage";
import EmptyState from "@/components/dashboard/EmptyState";

export default function PYQsPage() {
  return (
    <SectionPage
      title="Previous Year Questions"
      description="Practice previous year university examination papers."
      icon={<ClipboardList className="h-6 w-6" />}
      action="+ Add PYQ"
    >
      <EmptyState
        icon={<Plus className="h-7 w-7" />}
        title="No PYQs yet"
        description="Add previous year papers and organize them by subject, semester and exam."
        action="Add PYQ"
      />
    </SectionPage>
  );
}