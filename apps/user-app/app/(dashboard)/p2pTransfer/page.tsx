"use client";

import { useState } from "react";
import CardComponent from "@repo/ui/CardComponent";
import Center from "@repo/ui/Center";
import TextInput from "@repo/ui/TextInput";
import { Button } from "@repo/ui/Button";
import PaymentModal from "@repo/ui/PaymentModal";
import { verifyRecipient } from "@/app/lib/actions/verifyRecipient";
import { peerTransfer } from "@/app/lib/actions/peerTransfer";

export default function P2PTransferPage() {
    const [recipient, setRecipient] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [recipientName, setRecipientName] = useState<string>("");
    const [statusError, setStatusError] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [transferInitiated, setTransferInitiated] = useState<boolean>(false);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        status: "idle" | "processing" | "success" | "error";
        errorMessage?: string;
    }>({
        isOpen: false,
        status: "idle",
    });

    const handleRecipientChange = (val: string) => {
        setRecipient(val);
        if (isVerified || statusError) {
            setIsVerified(false);
            setRecipientName("");
            setStatusError(null);
        }
    };

    const handleVerification = async () => {
        if (!recipient.trim()) {
            setStatusError("Please enter a valid recipient email");
            return;
        }

        setLoading(true);
        setStatusError(null);

        try {
            const result = await verifyRecipient(recipient);
            if (result.success) {
                setIsVerified(true);
                setRecipientName(result.name ?? "Payzee User");
            } else {
                setIsVerified(false);
                setStatusError(result.message ?? "User not found");
            }
        } catch {
            setStatusError("Something went wrong while verifying");
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!isVerified || !amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        setModalState({ isOpen: true, status: "processing" });

        try {
            const result = await peerTransfer(recipient, Number(amount) * 100);

            // Brief delay to allow the 3D coin animation to complete its spin cycle smoothly
            await new Promise((r) => setTimeout(r, 1600));

            if (!result.success) {
                setModalState({
                    isOpen: true,
                    status: "error",
                    errorMessage: result.message ?? "Unable to send money right now",
                });
            } else {
                setModalState({ isOpen: true, status: "success" });
                setTransferInitiated(true);
                setStatusError(null);
            }
        } catch (e: any) {
            setModalState({
                isOpen: true,
                status: "error",
                errorMessage: e?.message || "Failed to send money. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F111A] tracking-tight">
                    Peer-to-Peer Transfer
                </h1>
                <p className="text-xs sm:text-sm text-[#646A79] mt-1">
                    Send funds instantly to any registered Payzee member with zero fees.
                </p>
            </div>

            <Center>
                <div className="w-full max-w-md">
                    <CardComponent
                        title="Send Money"
                        subtitle="Instant wallet-to-wallet transfer"
                        badge={
                            <div className="w-8 h-8 rounded-lg bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center">
                                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </div>
                        }
                    >
                        {(isVerified || statusError) && (
                            <div className="flex justify-center mb-4">
                                {statusError ? (
                                    <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md text-center">
                                        {statusError}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md text-center">
                                            Verified: {recipientName}
                                        </div>
                                        {transferInitiated && (
                                            <div className="mt-3 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-center">
                                                {`✓ Transfer of ₹${amount} to ${recipientName} completed successfully.`}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-5">
                            <TextInput
                                label="Recipient Email"
                                type="text"
                                placeholder="e.g. user@example.com"
                                value={recipient}
                                onChange={handleRecipientChange}
                                required
                            />
                            <TextInput
                                label="Amount"
                                type="number"
                                min="1"
                                step="100"
                                placeholder="0.00"
                                prefix="₹"
                                value={amount}
                                onChange={setAmount}
                                required
                                disabled={!isVerified}
                                inputClassName="disabled:cursor-default"
                            />
                            <div className="pt-2">
                                <Button
                                    variant="primary"
                                    disabled={
                                        loading ||
                                        !recipient.trim() ||
                                        (isVerified && (!amount || Number(amount) <= 0))
                                    }
                                    onClick={!isVerified ? handleVerification : handleTransfer}
                                >
                                    {loading
                                        ? isVerified
                                            ? "Sending..."
                                            : "Verifying..."
                                        : isVerified
                                            ? "Send Money"
                                            : "Verify"}
                                </Button>
                            </div>
                        </div>
                    </CardComponent>
                </div>
            </Center>

            {/* Razorpay-style 3D Coin Transfer Animation Modal */}
            <PaymentModal
                isOpen={modalState.isOpen}
                status={modalState.status}
                amount={amount}
                sourceName="Payzee Wallet"
                destinationName={recipientName || recipient}
                errorMessage={modalState.errorMessage}
                onClose={() => setModalState({ isOpen: false, status: "idle" })}
                onSuccessDone={() => {
                    setModalState({ isOpen: false, status: "idle" });
                    setAmount("");
                    setRecipient("");
                    setIsVerified(false);
                    setRecipientName("");
                    setTransferInitiated(false);
                }}
            />
        </div>
    );
}
