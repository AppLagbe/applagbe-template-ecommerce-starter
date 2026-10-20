import { prisma } from "@/lib/db";
import { AnnouncementBar } from "@/features/storefront/AnnouncementBar";
import { Header } from "@/features/storefront/Header";
import { Footer } from "@/features/storefront/Footer";
import { LandingPageRenderer } from "@/features/storefront/LandingPageRenderer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            No Active Product Found
          </h2>
          <p className="text-sm text-slate-600">
            Please run the database seed (`npm run db:seed`) or configure a product in the admin portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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
          isPreview={false}
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
