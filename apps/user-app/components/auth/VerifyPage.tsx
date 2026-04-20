"use client";

import { useState, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@repo/ui/AuthCard";
import { TextInput } from "@repo/ui/TextInput";
import { Button } from "@repo/ui/Button";

function VerifyContent() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid OTP");
            } else {
                router.push("/auth/signin?message=verified");
            }
        } catch (err) {
            setError("Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendMessage("");
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setResendMessage("Success! Check your inbox.");
            } else {
                setResendMessage(data.message || "Failed to resend");
            }
        } catch (err) {
            setResendMessage("Error resending OTP");
        } finally {
            setResendLoading(false);
            setTimeout(() => setResendMessage(""), 5000);
        }
    };

    return (
        <AuthCard title="Verify Code" subtitle={`Sent to ${email}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <TextInput 
                    label="Verification Code"
                    value={otp}
                    onChange={setOtp}
                    placeholder="000000"
                    required
                />
                
                {error && (
                    <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <Button type="submit" onClick={() => {}} disabled={loading || otp.length < 6}>
                    {loading ? "Verifying..." : "Confirm Code"}
                </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
                <button 
                    onClick={handleResend}
                    disabled={resendLoading}
                    className={`text-sm font-medium transition-colors ${resendLoading ? "text-zinc-500" : "text-blue-500 hover:text-blue-400"}`}
                >
                    {resendLoading ? "Resending..." : "Resend OTP"}
                </button>
                
                {resendMessage && (
                    <p className={`text-xs font-medium ${resendMessage.includes("Success") ? "text-green-500" : "text-red-500"}`}>
                        {resendMessage}
                    </p>
                )}

                <div>
                    <a href="/auth/signup" className="text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors">Back to Signup</a>
                </div>
            </div>
        </AuthCard>
    );
}

export const VerifyPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-sm font-medium text-zinc-500">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
};
