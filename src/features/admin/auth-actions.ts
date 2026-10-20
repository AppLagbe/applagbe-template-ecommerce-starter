"use server";

import { prisma } from "@/lib/db";
import { createAdminSession, clearAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
