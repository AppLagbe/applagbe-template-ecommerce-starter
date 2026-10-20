import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/db";
import { ThemeTokens } from "@/features/theme/ThemeTokens";

export async function generateMetadata(): Promise<Metadata> {
  const setting = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  return {
    title: setting?.storeName || "App Lagbe Commerce Starter",
    description: setting?.storeTagline || "High Converting E-commerce Landing Page",
    icons: setting?.faviconUrl ? [{ url: setting.faviconUrl }] : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setting = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <html lang="bn">
      <body className="antialiased selection:bg-brand-primary/20 selection:text-brand-primary">
        <ThemeTokens setting={setting} />
        {children}
      </body>
    </html>
  );
}
