"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { OnRampStatus, prisma } from "@repo/db";

export async function createOnRampTransactions (amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if(!userId) {
        return {
            message: "User not logged in"
        } 
    }

    const token = crypto.randomUUID();

    await prisma.onRampTransaction.create({
        data: {
            userId,
            amount: amount,
            status: OnRampStatus.Processing,
            provider,
            startTime: new Date(),
            token
        }
    });

    try{
        const webHookUrl = process.env.BANK_WEBHOOK_URL || "";
        const bankWebhookSecret = process.env.BANK_WEBHOOK_SECRET || "";

        const res = await fetch(webHookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-bank-secret": bankWebhookSecret
            },
            body: JSON.stringify({
                token,
                user_identifier: userId,
                amount
            })
        });

        if(!res.ok){
            return {
                success: false,
                message: "Transaction created, but bank webhook failed to capture"
            }
        }

        return {
            success: true,
            message: "On-ramp transaction completed successfully",
        }
    }
    catch(e) {
        return {
            success: false,
            message: "Could not reach bank webhook server",
        }
    }
}