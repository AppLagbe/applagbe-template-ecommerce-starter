import React from "react";
import { SiteSetting } from "@prisma/client";

export function ThemeTokens({ setting }: { setting: Partial<SiteSetting> | null }) {
  const primary = setting?.primaryColor || "#059669";
  const accent = setting?.accentColor || "#ea580c";
  const bg = setting?.backgroundColor || "#f8fafc";
  const radius = setting?.borderRadius || "0.75rem";
  const font = setting?.fontFamily || "Inter, -apple-system, sans-serif";

  // Compute slight dark hover variants
  const primaryHover = adjustColor(primary, -15);
  const accentHover = adjustColor(accent, -15);

  const css = `
    :root {
      --brand-primary: ${primary};
      --brand-primary-hover: ${primaryHover};
      --brand-accent: ${accent};
      --brand-accent-hover: ${accentHover};
      --brand-bg: ${bg};
      --brand-radius: ${radius};
      --font-brand: ${font};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// Simple color shade helper for hex colors
function adjustColor(hex: string, percent: number): string {
  try {
    let clean = hex.replace("#", "");
    if (clean.length === 3) {
      clean = clean.split("").map((c) => c + c).join("");
    }
    const num = parseInt(clean, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}
