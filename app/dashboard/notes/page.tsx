"use client";

import { FileText, Plus } from "lucide-react";
import SectionPage from "@/components/dashboard/SectionPage";
import EmptyState from "@/components/dashboard/EmptyState";

export default function NotesPage() {
  return (
    <SectionPage
      title="Notes"
      description="Access and organize study notes unit-wise."
      icon={<FileText className="h-6 w-6" />}
      action="+ Upload Notes"
    >
      <EmptyState
        icon={<Plus className="h-7 w-7" />}
        title="No notes available"
        description="Upload PDFs, documents and study material for your subjects."
        action="Upload Notes"
      />
    </SectionPage>
  );
}