"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBrandingSettings(formData: FormData) {
  try {
    const storeName = formData.get("storeName") as string;
    const storeTagline = formData.get("storeTagline") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const accentColor = formData.get("accentColor") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const supportPhone = formData.get("supportPhone") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const officeAddress = formData.get("officeAddress") as string;
    const announcementBar = formData.get("announcementBar") as string;
    const isAnnouncementActive = formData.get("isAnnouncementActive") === "on";

    await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        storeName,
        storeTagline,
        primaryColor,
        accentColor,
        backgroundColor,
        supportPhone,
        whatsappNumber,
        supportEmail,
        officeAddress,
        announcementBar,
        isAnnouncementActive,
      },
      create: {
        id: "default",
        storeName,
        storeTagline,
        primaryColor,
        accentColor,
        backgroundColor,
        supportPhone,
        whatsappNumber,
        supportEmail,
        officeAddress,
        announcementBar,
        isAnnouncementActive,
      },
    });

    revalidatePath("/admin/branding");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
