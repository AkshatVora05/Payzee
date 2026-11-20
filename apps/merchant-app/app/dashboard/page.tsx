"use client";

import { AppbarMerchant } from "@/components/common/AppbarMerchant";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MerchantDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-sm font-semibold text-[#646A79] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5844ED] animate-ping" />
          Loading merchant account...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      <AppbarMerchant />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-8">
          {/* Merchant Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F111A] tracking-tight">
                Merchant Operations Console
              </h1>
              <p className="text-xs sm:text-sm text-[#646A79] mt-0.5">
                Real-time transaction capture, settlement accounts, and webhook telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Merchant Node
              </span>
            </div>
          </div>

          {/* Merchant Overview Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#646A79]">
                  Settlement Balance
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F111A] tracking-tight mt-1">
                  ₹0.00
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-10 px-4 rounded-xl text-xs font-semibold text-white bg-[#5844ED] hover:bg-[#4C35E0] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  Withdraw to Bank
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div>
                <div className="text-xs text-[#646A79] font-medium">Gross Captured Today</div>
                <div className="text-lg font-bold text-[#0F111A] mt-0.5">₹0.00</div>
              </div>
              <div>
                <div className="text-xs text-[#646A79] font-medium">Pending Webhook Credits</div>
                <div className="text-lg font-bold text-[#646A79] mt-0.5">₹0.00</div>
              </div>
              <div>
                <div className="text-xs text-[#646A79] font-medium">Partner Account</div>
                <div className="text-sm font-semibold text-[#0F111A] mt-0.5 truncate">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Integration & Security Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0F111A]">
                  Webhook Telemetry
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready (Port 3003)
                </span>
              </div>
              <p className="text-xs text-[#646A79] leading-relaxed mb-4">
                HDFC bank captures require the <code className="text-[#5844ED] font-mono text-xs">x-hdfc-secret</code> header matching your environment secret.
              </p>
              <div className="p-3 bg-[#F8F9FB] border border-gray-200/80 rounded-xl font-mono text-xs text-[#0F111A]">
                POST http://localhost:3003/hdfcWebhook
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#0F111A] mb-2">
                Developer Credentials
              </h3>
              <p className="text-xs text-[#646A79] leading-relaxed mb-4">
                Manage OAuth callback origins and sandbox API access keys across your storefronts.
              </p>
              <div className="text-xs font-semibold text-[#5844ED] flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Active Session Token Authenticated
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
