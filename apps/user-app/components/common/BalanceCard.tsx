import CardComponent from "@repo/ui/CardComponent";

export const BalanceCard = ({
  amount,
  locked,
}: {
  amount: number;
  locked: number;
}) => {
  const unlockedRupees = amount / 100;
  const lockedRupees = locked / 100;
  const totalRupees = (amount + locked) / 100;

  const unlockedPercent = totalRupees > 0 ? (unlockedRupees / totalRupees) * 100 : 100;

  return (
    <CardComponent
      title="Wallet Balance"
      subtitle="Real-time ledger overview"
      badge={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      }
    >
      <div className="space-y-6">
        {/* Total Big Headline */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#646A79]">
            Total Account Value
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-[#0F111A] tracking-tight tabular-nums mt-1 flex items-baseline gap-1.5">
            <span>₹{totalRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs font-bold text-[#646A79]">INR</span>
          </div>
        </div>

        {/* Visual Balance Distribution Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="bg-[#5844ED] h-full transition-all duration-300"
              style={{ width: `${unlockedPercent}%` }}
              title={`Unlocked: ${unlockedPercent.toFixed(1)}%`}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${100 - unlockedPercent}%` }}
              title={`Locked: ${(100 - unlockedPercent).toFixed(1)}%`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#646A79]">
            <span>{unlockedPercent.toFixed(0)}% available</span>
            <span>{(100 - unlockedPercent).toFixed(0)}% in transit</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center py-2.5 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-2 text-[#4B5162]">
              <span className="w-2 h-2 rounded-full bg-[#5844ED]" />
              <span className="font-medium">Unlocked Balance</span>
            </div>
            <span className="font-bold text-[#0F111A] tabular-nums">
              ₹{unlockedRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-2 text-[#4B5162]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-medium">Total Locked Balance</span>
            </div>
            <span className="font-bold text-[#646A79] tabular-nums">
              ₹{lockedRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 text-sm">
            <span className="font-semibold text-[#0F111A]">Net Total</span>
            <span className="font-bold text-[#5844ED] text-base tabular-nums">
              ₹{totalRupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default BalanceCard;
