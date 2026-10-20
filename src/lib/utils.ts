import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

export function validateBDPhone(phone: string): { isValid: boolean; normalized: string } {
  // Cleans spaces, dashes, +88 prefix
  let clean = phone.replace(/[\s\-\(\)\+]/g, "");
  if (clean.startsWith("880")) {
    clean = clean.substring(2); // "017..."
  } else if (clean.startsWith("88")) {
    clean = clean.substring(2);
  }

  // Regex for Bangladesh mobile numbers: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  const isValid = bdPhoneRegex.test(clean);

  return {
    isValid,
    normalized: clean,
  };
}
