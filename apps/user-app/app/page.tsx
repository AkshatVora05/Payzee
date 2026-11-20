"use client";

import { Background } from "@repo/ui/Background";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col relative overflow-hidden">

      <main>
        <div className="text-center flex flex-col items-center relative">
          <Background />

          {/* Hero Main Heading */}
          <h1 className="pt-20 text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0F111A] tracking-tight max-w-4xl leading-[1.08] relative z-10">
            Payments defying friction,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5844ED] via-[#7B61FF] to-[#06B6D4]">
              built in motion.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-[#4B5162] max-w-2xl leading-relaxed relative z-10 font-normal">
            Experience atomic peer-to-peer transfers, webhook-verified on-ramp banking, and instant settlement designed with Kraken precision.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center relative z-10">
            {session?.user ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-sm text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-md shadow-[#5844ED]/25 hover:shadow-lg hover:shadow-[#5844ED]/30 transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/auth/signup")}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-sm text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-md shadow-[#5844ED]/25 hover:shadow-lg hover:shadow-[#5844ED]/30 transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  Create free account
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/auth/signin")}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-sm text-[#0F111A] bg-white/95 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Metrics Ribbon */}
          <div className="mt-14 py-4 px-6 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/70 shadow-xs flex flex-wrap items-center justify-center gap-8 sm:gap-7 text-center relative z-10">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0F111A]">₹0</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#646A79]">Transfer Fees</div>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#5844ED]">99.99%</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#646A79]">Platform Uptime</div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="pb-20 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl w-full relative z-10">
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-[#5844ED]/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F111A] mb-1.5">
                Instant Settlement
              </h3>
              <p className="text-xs text-[#646A79] leading-relaxed">
                Real-time wallet updates and atomic DB transactions without delays or manual reconciliation.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-[#5844ED]/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F111A] mb-1.5">
                Verified Webhooks
              </h3>
              <p className="text-xs text-[#646A79] leading-relaxed">
                Bank-grade shared secret signatures and Zod validation protecting every single inbound credit event.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-[#5844ED]/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#0F111A] mb-1.5">
                Merchant Integration
              </h3>
              <p className="text-xs text-[#646A79] leading-relaxed">
                Dedicated merchant gateway with Google and GitHub OAuth to streamline business payouts.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
