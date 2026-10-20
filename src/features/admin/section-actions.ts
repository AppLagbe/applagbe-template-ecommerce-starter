"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function reorderSection(sectionId: string, direction: "up" | "down") {
  try {
    const sections = await prisma.sectionConfig.findMany({
      where: { pageId: "landing-home" },
      orderBy: { sortOrder: "asc" },
    });

    const index = sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return { success: false, error: "Section not found" };

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) {
      return { success: false, error: "Cannot move further" };
    }

    const currentSec = sections[index];
    const targetSec = sections[targetIndex];

    await prisma.$transaction([
      prisma.sectionConfig.update({
        where: { id: currentSec.id },
        data: { sortOrder: targetSec.sortOrder },
      }),
      prisma.sectionConfig.update({
        where: { id: targetSec.id },
        data: { sortOrder: currentSec.sortOrder },
      }),
    ]);

    revalidatePath("/admin/sections");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleSectionVisibility(sectionId: string, isEnabled: boolean) {
  try {
    await prisma.sectionConfig.update({
      where: { id: sectionId },
      data: { isEnabled },
    });

    revalidatePath("/admin/sections");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveSectionDraft(sectionId: string, draftJson: string) {
  try {
    // Validate that it's valid JSON
    JSON.parse(draftJson);

    await prisma.sectionConfig.update({
      where: { id: sectionId },
      data: {
        draftContent: draftJson,
        hasUnpublishedChanges: true,
      },
    });

    revalidatePath("/admin/sections");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Invalid JSON format: " + err.message };
  }
}

export async function publishAllSections() {
  try {
    const sections = await prisma.sectionConfig.findMany({
      where: { pageId: "landing-home" },
    });

    for (const sec of sections) {
      await prisma.sectionConfig.update({
        where: { id: sec.id },
        data: {
          publishedContent: sec.draftContent || sec.publishedContent,
          hasUnpublishedChanges: false,
        },
      });
    }

    revalidatePath("/admin/sections");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
