import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #059669)",
          "primary-hover": "var(--brand-primary-hover, #047857)",
          accent: "var(--brand-accent, #ea580c)",
          "accent-hover": "var(--brand-accent-hover, #c2410c)",
          bg: "var(--brand-bg, #f8fafc)",
          surface: "var(--brand-surface, #ffffff)",
          "text-main": "var(--brand-text-main, #0f172a)",
          "text-muted": "var(--brand-text-muted, #64748b)",
          border: "var(--brand-border, #e2e8f0)",
          badge: "var(--brand-badge, #ecfdf5)",
          "badge-text": "var(--brand-badge-text, #065f46)",
        },
      },
      borderRadius: {
        brand: "var(--brand-radius, 0.75rem)",
      },
      boxShadow: {
        brand: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        floating: "0 20px 35px -10px rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        brand: ["var(--font-brand, sans-serif)"],
        bengali: ["'Hind Siliguri'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
