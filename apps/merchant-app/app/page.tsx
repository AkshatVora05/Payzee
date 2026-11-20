"use client";

import { AppbarMerchant } from "@/components/common/AppbarMerchant";
import { Background } from "@repo/ui/Background";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MerchantLandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col relative overflow-hidden">
      <AppbarMerchant />

      <main>
        <div className="text-center flex flex-col items-center relative">
          <Background />

          <h1 className="pt-20 text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0F111A] tracking-tight max-w-4xl leading-[1.08] relative z-10">
            Accept payments with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5844ED] via-[#7B61FF] to-[#06B6D4]">
              zero friction.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#4B5162] max-w-2xl leading-relaxed relative z-10">
            Unified payment infrastructure for fast-growing businesses. Built-in webhooks, bank-grade verification, and comprehensive ledger management.
          </p>

          <div className="pb-45 mt-10 relative z-10">
            {session?.user ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="h-12 px-8 rounded-xl font-semibold text-sm text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-md shadow-[#5844ED]/25 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                Go to Merchant Dashboard
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="h-12 px-8 rounded-xl font-semibold text-sm text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-md shadow-[#5844ED]/25 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                Access Merchant Portal
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
