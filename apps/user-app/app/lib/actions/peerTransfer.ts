"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function peerTransfer(recipient: string, amount: number) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return {
            success: false,
            message: "Unauthorized access",
        };
    }

    if (!recipient.trim() || !amount || amount <= 0) {
        return {
            success: false,
            message: "Invalid recipient or amount",
        };
    }

    try {
        await prisma.$transaction(async (txn) => {
            const toUser = await txn.user.findUnique({
                where: {
                    email: recipient.trim(),
                },
                select: {
                    id: true,
                },
            });

            if (!toUser) {
                throw new Error("Recipient not found");
            }

            if (toUser.id === Number(userId)) {
                throw new Error("You cannot send money to yourself");
            }

            // In PostgreSQL, table and column names created by Prisma are quoted ("Balance", "userId").
            // Also userId must be cast to Number since session.user.id is a string.
            await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(userId)} FOR UPDATE;`;

            const fromBalance = await txn.balance.findUnique({
                where: {
                    userId: Number(userId),
                },
            });

            if (!fromBalance || amount > fromBalance.amount) {
                throw new Error("Insufficient funds");
            }

            await txn.balance.update({
                where: {
                    userId: Number(userId),
                },
                data: {
                    amount: {
                        decrement: amount,
                    },
                },
            });

            await txn.balance.upsert({
                where: {
                    userId: toUser.id,
                },
                update: {
                    amount: {
                        increment: amount,
                    },
                },
                create: {
                    userId: toUser.id,
                    amount: amount,
                    locked: 0,
                },
            });

            await txn.p2PTransaction.create({
                data: {
                    from: Number(userId),
                    to: toUser.id,
                    amount: amount,
                    timestamp: new Date(),
                },
            });
        });

        return {
            success: true,
            message: "Amount transferred successfully",
        };
    } catch (e: any) {
        console.error("P2P transfer error:", e);
        return {
            success: false,
            message: e?.message || "An error occurred while processing transaction",
        };
    }
}
