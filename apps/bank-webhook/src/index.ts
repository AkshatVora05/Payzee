import "dotenv/config";
import { OnRampStatus, prisma } from '@repo/db';
import express from "express";
import { PayloadSchema } from '@repo/common';

const app = express();
app.use(express.json());

app.post("/bankWebhook", async (req, res) => {
    const secretHeader = req.headers["x-bank-secret"] as string | undefined;
    const expectedSecret = process.env.BANK_WEBHOOK_SECRET;

    if (!expectedSecret || secretHeader !== expectedSecret) {
        // console.log("Invalid or missing Bank webhook secret");
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const parseResult = PayloadSchema.safeParse(req.body);
    if (!parseResult.success) {
        // console.log("Invalid Payload");
        return res.status(400).json({
            success: false,
            message: "Invalid payload"
        });
    }

    const { token, user_identifier, amount } = parseResult.data;

    try {
        const txnRecord = await prisma.onRampTransaction.findUnique({
            where: {
                token
            }
        });

        if (!txnRecord) {
            // console.log("Transaction not found");
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Validate data integrity: ensure user and amount match the initiated transaction
        if (txnRecord.userId !== user_identifier || txnRecord.amount !== amount) {
            // console.log("Data mismatch");
            return res.status(400).json({
                success: false,
                message: "Data mismatch"
            });
        }

        // Idempotency: If already succeeded, return 200 OK so bank webhook stops retrying
        if (txnRecord.status === OnRampStatus.Success) {
            // console.log("Transaction already processed");
            return res.status(200).json({
                success: true,
                message: "Transaction already processed"
            });
        }

        // If previously marked as failed, do not credit
        if (txnRecord.status === OnRampStatus.Failure) {
            // console.log("Transaction previously marked as failed");
            return res.status(400).json({
                success: false,
                message: "Transaction previously marked as failed"
            });
        }

        // Atomic execution with race condition prevention:
        // Update status to Success ONLY if it is still 'Processing'
        await prisma.$transaction(async (tx) => {
            const updated = await tx.onRampTransaction.updateMany({
                where: {
                    token,
                    status: OnRampStatus.Processing
                },
                data: {
                    status: OnRampStatus.Success
                }
            });

            // If another concurrent request processed it first, abort double-crediting
            if (updated.count === 0) {
                return;
            }

            // Upsert balance so users without an existing balance row get created safely
            await tx.balance.upsert({
                where: {
                    userId: user_identifier
                },
                update: {
                    amount: {
                        increment: amount
                    }
                },
                create: {
                    userId: user_identifier,
                    amount,
                    locked: 0
                }
            });
        });

        // console.log("Captured");
        return res.status(200).json({
            success: true,
            message: "Captured"
        });
    } catch (e) {
        // console.log("Error while processing webhook:", e);
        // Do NOT mark as Failure on server/DB exceptions. Return 500 so the bank can safely retry.
        return res.status(500).json({
            success: false,
            message: "Error while processing webhook"
        });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Bank webhook server running`);
});
