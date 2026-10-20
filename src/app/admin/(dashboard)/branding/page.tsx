import React from "react";
import { prisma } from "@/lib/db";
import { BrandingEditor } from "@/features/admin/BrandingEditor";

export const dynamic = "force-dynamic";

export default async function AdminBrandingPage() {
  const setting = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  if (!setting) {
    return <div>No setting found. Please run seed script.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Client Branding & Design Tokens
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure client colors, logo, typography, contact details, and announcement banner.
        </p>
      </div>

      <BrandingEditor setting={setting} />
    </div>
  );
}
