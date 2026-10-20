import { prisma } from "@/lib/db";
import { AnnouncementBar } from "@/features/storefront/AnnouncementBar";
import { Header } from "@/features/storefront/Header";
import { Footer } from "@/features/storefront/Footer";
import { LandingPageRenderer } from "@/features/storefront/LandingPageRenderer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const [siteSetting, product, deliveryZones, sections] = await Promise.all([
    prisma.siteSetting.findUnique({
      where: { id: "default" },
    }),
    prisma.product.findFirst({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        bundles: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.sectionConfig.findMany({
      where: { pageId: "landing-home" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product || !siteSetting) {
    return <div>No active product found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Floating Admin Back Banner */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold">Live Draft Preview Mode (Unpublished changes visible)</span>
        </div>
        <Link
          href="/admin/sections"
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Section Editor</span>
        </Link>
      </div>

      <AnnouncementBar
        message={siteSetting.announcementBar}
        isActive={siteSetting.isAnnouncementActive}
      />
      <Header
        storeName={siteSetting.storeName}
        storeTagline={siteSetting.storeTagline}
        logoUrl={siteSetting.logoUrl}
        supportPhone={siteSetting.supportPhone}
        whatsappNumber={siteSetting.whatsappNumber}
      />
      <div className="flex-1">
        <LandingPageRenderer
          sections={sections}
          product={product}
          deliveryZones={deliveryZones}
          siteSetting={siteSetting}
          isPreview={true}
        />
      </div>
      <Footer
        storeName={siteSetting.storeName}
        storeTagline={siteSetting.storeTagline}
        supportPhone={siteSetting.supportPhone}
        supportEmail={siteSetting.supportEmail}
        officeAddress={siteSetting.officeAddress}
      />
    </div>
  );
}
