import CardComponent from "@repo/ui/CardComponent";
import { OnRampStatus } from "@repo/db/enums";

export default function OnRampTransactions({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: OnRampStatus;
    provider: string;
  }[];
}) {
  if (!transactions.length) {
    return (
      <CardComponent
        title="Recent Deposits"
        subtitle="Live on-ramp transfers history"
      >
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#0F111A]">
            No recent deposits
          </span>
          <p className="text-xs text-[#646A79] mt-1 max-w-[220px]">
            Funds deposited via NetBanking will appear here automatically.
          </p>
        </div>
      </CardComponent>
    );
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

  return (
    <CardComponent
      title="Recent Deposits"
      subtitle="Live on-ramp transfers history"
      badge={
        <span className="text-xs font-semibold text-[#5844ED]">
          {transactions.length} record{transactions.length > 1 ? "s" : ""}
        </span>
      }
    >
      <div className="divide-y divide-gray-100 -my-2">
        {transactions.map((txn, idx) => (
          <div key={idx} className="flex justify-between items-center py-3.5">
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
    </CardComponent>
  );
}

export { OnRampStatus };
