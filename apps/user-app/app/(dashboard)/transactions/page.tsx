import { authOptions } from "@/app/lib/auth";
import { prisma } from "@repo/db";
import { OnRampStatus } from "@repo/db/enums";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export interface UnifiedTransaction {
  id: string;
  type: "bank_deposit" | "p2p_sent" | "p2p_received";
  time: Date;
  amount: number;
  title: string;
  subtitle: string;
  status: "Success" | "Processing" | "Failure";
  isPositive: boolean;
  avatarText: string;
  badgeLabel: string;
}

const ITEMS_PER_PAGE = 10;

async function getAllTransactions(userId: number): Promise<UnifiedTransaction[]> {
  const [onRampTxns, p2pTxns] = await Promise.all([
    prisma.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
    }),
    prisma.p2PTransaction.findMany({
      where: {
        OR: [{ from: userId }, { to: userId }],
      },
      include: {
        fromUser: {
          select: { id: true, name: true, email: true },
        },
        toUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { timestamp: "desc" },
    }),
  ]);

  const unified: UnifiedTransaction[] = [];

  // Map Bank On-Ramp Transactions
  for (const txn of onRampTxns) {
    unified.push({
      id: `onramp-${txn.id}`,
      type: "bank_deposit",
      time: txn.startTime,
      amount: txn.amount,
      title: txn.provider || "NetBanking Deposit",
      subtitle: "Bank to Payzee Wallet",
      status: txn.status as "Success" | "Processing" | "Failure",
      isPositive: true,
      avatarText: (txn.provider || "BK").slice(0, 2).toUpperCase(),
      badgeLabel: txn.status,
    });
  }

  // Map P2P Transactions (Sent & Received)
  for (const txn of p2pTxns) {
    const isSender = txn.from === userId;

    if (isSender) {
      const recipientLabel = txn.toUser.name || txn.toUser.email;
      unified.push({
        id: `p2p-${txn.id}`,
        type: "p2p_sent",
        time: txn.timestamp,
        amount: txn.amount,
        title: `To: ${recipientLabel}`,
        subtitle: `Sent to ${txn.toUser.email}`,
        status: "Success",
        isPositive: false,
        avatarText: recipientLabel.slice(0, 2).toUpperCase(),
        badgeLabel: "Sent",
      });
    } else {
      const senderLabel = txn.fromUser.name || txn.fromUser.email;
      unified.push({
        id: `p2p-${txn.id}`,
        type: "p2p_received",
        time: txn.timestamp,
        amount: txn.amount,
        title: `From: ${senderLabel}`,
        subtitle: `Received from ${txn.fromUser.email}`,
        status: "Success",
        isPositive: true,
        avatarText: senderLabel.slice(0, 2).toUpperCase(),
        badgeLabel: "Received",
      });
    }
  }

  // Sort by time: latest one up, older ones after
  unified.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return unified;
}

const getBadgeStyle = (txn: UnifiedTransaction) => {
  if (txn.type === "p2p_sent") {
    return "bg-rose-50 text-rose-700 border-rose-200/80";
  }
  if (txn.type === "p2p_received") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  }

  switch (txn.status) {
    case "Success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case "Processing":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "Failure":
      return "bg-red-50 text-red-700 border-red-200/80";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200/80";
  }
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; filter?: string }> | { page?: string; filter?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const requestedPage = parseInt(resolvedParams?.page || "1", 10) || 1;
  const currentFilter = resolvedParams?.filter || "all";

  const allTransactions = await getAllTransactions(Number(session.user.id));

  // Apply tab filter if any
  const filteredTransactions = allTransactions.filter((txn) => {
    if (currentFilter === "bank") return txn.type === "bank_deposit";
    if (currentFilter === "p2p") return txn.type === "p2p_sent" || txn.type === "p2p_received";
    return true;
  });

  const totalCount = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F111A] tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-[#646A79] mt-1">
            Real-time combined ledger of all bank deposits and peer-to-peer transfers.
          </p>
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
            Send Money
          </Link>
        </div>
      </div>

      {/* Main Transactions Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        {/* Card Header & Filter / Pagination Controls (ABOVE the transactions list) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-5 border-b border-gray-100">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8F9FB] rounded-xl border border-gray-200/70 w-fit">
            <Link
              href={`/transactions?filter=all&page=1`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === "all"
                  ? "bg-white text-[#5844ED] shadow-xs"
                  : "text-[#646A79] hover:text-[#0F111A]"
              }`}
            >
              All ({allTransactions.length})
            </Link>
            <Link
              href={`/transactions?filter=bank&page=1`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === "bank"
                  ? "bg-white text-[#5844ED] shadow-xs"
                  : "text-[#646A79] hover:text-[#0F111A]"
              }`}
            >
              Bank Deposits ({allTransactions.filter((t) => t.type === "bank_deposit").length})
            </Link>
            <Link
              href={`/transactions?filter=p2p&page=1`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === "p2p"
                  ? "bg-white text-[#5844ED] shadow-xs"
                  : "text-[#646A79] hover:text-[#0F111A]"
              }`}
            >
              P2P Transfers ({allTransactions.filter((t) => t.type !== "bank_deposit").length})
            </Link>
          </div>

          {/* Pagination Controls ABOVE Transactions */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-[#646A79] mr-1">
                Page {currentPage} of {totalPages}
              </span>

              {/* Prev Button */}
              <Link
                href={`/transactions?filter=${currentFilter}&page=${currentPage - 1}`}
                aria-disabled={currentPage <= 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                  currentPage <= 1
                    ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-[#0F111A] shadow-xs"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/transactions?filter=${currentFilter}&page=${pageNum}`}
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-[#5844ED] text-white shadow-xs"
                          : "bg-white hover:bg-gray-50 border border-gray-200 text-[#0F111A]"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {/* Next Button */}
              <Link
                href={`/transactions?filter=${currentFilter}&page=${currentPage + 1}`}
                aria-disabled={currentPage >= totalPages}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-[#0F111A] shadow-xs"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {paginatedTransactions.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#646A79]">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            No transactions found for this selection.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center py-4 hover:bg-[#F8F9FB]/50 -mx-3 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Type Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 font-bold text-xs ${
                      txn.type === "p2p_sent"
                        ? "bg-rose-50 border-rose-200/60 text-rose-600"
                        : txn.type === "p2p_received"
                        ? "bg-emerald-50 border-emerald-200/60 text-emerald-600"
                        : "bg-[#F8F9FB] border-gray-200/60 text-[#5844ED]"
                    }`}
                  >
                    {txn.avatarText}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0F111A] truncate flex items-center gap-2">
                      <span>{txn.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#646A79] mt-0.5">
                      <span className="truncate">{txn.subtitle}</span>
                      <span>•</span>
                      <span className="shrink-0">
                        {new Date(txn.time).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Status Badge */}
                <div className="flex items-center gap-4 text-right shrink-0 ml-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${getBadgeStyle(
                      txn
                    )}`}
                  >
                    {txn.badgeLabel}
                  </span>
                  <div
                    className={`text-base font-bold tabular-nums ${
                      txn.isPositive ? "text-emerald-600" : "text-[#0F111A]"
                    }`}
                  >
                    {txn.isPositive ? "+" : "-"}₹
                    {(txn.amount / 100).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Pagination Info */}
        <div className="pt-5 mt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#646A79] gap-3">
          <span>
            Showing {totalCount > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, totalCount)} of {totalCount} transactions
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <span>Use pagination controls above to navigate pages</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
