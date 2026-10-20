import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900">404</h2>
        <p className="text-sm text-slate-600">
          Page not found or product is unavailable.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-sm hover:opacity-90 transition"
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
