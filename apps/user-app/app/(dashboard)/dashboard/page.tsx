import { authOptions } from "@/app/lib/auth";
import { prisma } from "@repo/db";
import { OnRampStatus } from "@repo/db/enums";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);

  const [balance, txns] = await Promise.all([
    prisma.balance.findFirst({
      where: { userId },
    }),
    prisma.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 5,
    }),
  ]);

  return {
    session,
    balance: {
      amount: balance?.amount ?? 0,
      locked: balance?.locked ?? 0,
    },
    transactions: txns.map((txn) => ({
      id: txn.id,
      time: txn.startTime,
      amount: txn.amount,
      status: txn.status,
      provider: txn.provider,
    })),
  };
}

const getStatusBadge = (status: OnRampStatus) => {
  switch (status) {
    case OnRampStatus.Success:
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case OnRampStatus.Processing:
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case OnRampStatus.Failure:
      return "bg-red-50 text-red-700 border-red-200/80";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200/80";
  }
};

export default async function UserDashboardPage() {
  const data = await getDashboardData();
  if (!data) {
    redirect("/auth/signin");
  }

  const { session, balance, transactions } = data;
  const unlockedRupees = balance.amount / 100;
  const lockedRupees = balance.locked / 100;
  const totalRupees = (balance.amount + balance.locked) / 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F111A] tracking-tight">
            Welcome back, {session.user?.name || "Member"}
          </h1>
          <p className="text-xs sm:text-sm text-[#646A79] mt-1">
            Manage your Payzee account, live balances, and bank transfers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Account
          </span>
        </div>
      </div>

      {/* Account Overview & Balances Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#646A79]">
              Total Balance
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#0F111A] tracking-tight tabular-nums mt-1">
              ₹{totalRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/transfer"
              className="h-10 px-4 rounded-xl text-xs font-semibold text-white bg-[#5844ED] hover:bg-[#4C35E0] transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Money
            </Link>
            <Link
              href="/p2pTransfer"
              className="h-10 px-4 rounded-xl text-xs font-semibold text-[#0F111A] bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-[#5844ED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send
            </Link>
          </div>
        </div>

        {/* Sub-balances breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div>
            <div className="text-xs text-[#646A79] font-medium">Unlocked Balance</div>
            <div className="text-lg font-bold text-[#0F111A] tabular-nums mt-0.5">
              ₹{unlockedRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#646A79] font-medium">Locked Funds</div>
            <div className="text-lg font-bold text-[#646A79] tabular-nums mt-0.5">
              ₹{lockedRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#646A79] font-medium">Account Email</div>
            <div className="text-sm font-semibold text-[#0F111A] mt-0.5 truncate">
              {session.user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0F111A]">
              Recent Activity
            </h3>
            {transactions.length > 0 && (
              <Link
                href="/transfer"
                className="text-xs font-semibold text-[#5844ED] hover:underline"
              >
                View all
              </Link>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#8A909F]">
              No transactions yet. Click &ldquo;Add Money&rdquo; to fund your account.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F9FB] border border-gray-200/60 flex items-center justify-center text-[#5844ED] shrink-0 font-bold text-xs">
                      {txn.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F111A]">
                        {txn.provider}
                      </div>
                      <div className="text-[11px] text-[#646A79] mt-0.5">
                        {new Date(txn.time).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getStatusBadge(
                        txn.status
                      )}`}
                    >
                      {txn.status}
                    </span>
                    <div className="text-sm font-bold text-[#0F111A] tabular-nums">
                      +₹{(txn.amount / 100).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bank Deposit Verification Card */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-[#0F111A] mb-1">
              Verified On-Ramp
            </h4>
            <p className="text-xs text-[#646A79] leading-relaxed mb-4">
              Instant balance credits protected by webhook secret token verification.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5844ED]">
              Protected by Payzee Security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
