import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Truck,
  Palette,
  Layers,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "@/features/admin/auth-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders Pipeline", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Delivery Rates", href: "/admin/delivery", icon: Truck },
    { label: "Branding & Tokens", href: "/admin/branding", icon: Palette },
    { label: "Section Editor", href: "/admin/sections", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              AL
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm tracking-wide">
                App Lagbe
              </h1>
              <p className="text-[10px] text-slate-400">Admin Control Center</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            PROD
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>View Live Store</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">↗</span>
            </Link>

            <Link
              href="/preview"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Draft Preview</span>
              </div>
              <span className="text-[10px] font-mono">↗</span>
            </Link>
          </div>
        </nav>

        {/* User bar & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{session.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{session.email}</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              title="Sign Out"
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
