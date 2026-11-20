"use client";

import { useState, useRef, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@repo/ui/AuthCard";
import { Button } from "@repo/ui/Button";

function VerifyContent() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid verification code");
      } else {
        router.push("/auth/signin?message=verified");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address is missing");
      return;
    }

    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendMessage(data.message || "New code sent to your email");
        setResendSuccess(true);
      } else {
        setResendMessage(data.message || "Failed to resend code");
        setResendSuccess(false);
      }
    } catch (err) {
      setResendMessage("Failed to resend code. Please try again.");
      setResendSuccess(false);
    } finally {
      setResendLoading(false);
      setTimeout(() => {
        setResendMessage("");
      }, 5000);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`Enter the code sent to ${email}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-semibold font-mono bg-white border border-[#E5E7EB] rounded-lg text-[#1A1A2E] outline-none transition-all focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF]/20"
            />
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading || otp.join("").length < 6}>
          {loading ? "Verifying..." : "Verify code"}
        </Button>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm font-medium text-[#7B61FF] hover:text-[#6C4FE0] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {resendLoading ? "Resending code..." : "Resend code"}
          </button>

          {resendMessage && (
            <p
              className={`text-xs text-center font-medium ${
                resendSuccess ? "text-green-600" : "text-red-500"
              }`}
            >
              {resendMessage}
            </p>
          )}

          <a
            href="/auth/signup"
            className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            Back to sign up
          </a>
        </div>
      </form>
    </AuthCard>
  );
}

export const VerifyPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center text-sm font-medium text-[#9CA3AF]">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
