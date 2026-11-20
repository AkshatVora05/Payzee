"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function verifyRecipient(email: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const user = await prisma.user.findFirst({
    where: { email: email.trim() },
    select: { id: true, name: true },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (String(user.id) === String(session.user.id)) {
    return { success: false, message: "You cannot send money to yourself" };
  }

  return {
    success: true,
    name: user.name || "Payzee User",
  };
}