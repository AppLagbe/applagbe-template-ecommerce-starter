import React from "react";
import { prisma } from "@/lib/db";
import { SectionEditor } from "@/features/admin/SectionEditor";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const sections = await prisma.sectionConfig.findMany({
    where: { pageId: "landing-home" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Visual Section Editor & Layout Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Reorder sections, toggle visibility, edit copy in draft mode, preview changes, and publish live.
        </p>
      </div>

      <SectionEditor sections={sections} />
    </div>
  );
}
