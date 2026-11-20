

import { authOptions } from "@/app/lib/auth";
import AddMoney from "@/components/common/AddMoneyCard";
import { BalanceCard } from "@/components/common/BalanceCard";
import OnRampTransactions from "@/components/common/OnRampTransactions";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });

    return {
        amount: balance?.amount ?? 0,
        locked: balance?.locked ?? 0
    };
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            startTime: "desc"
        }
    });

    return txns.map(txn => ({
        time: txn.startTime,
        amount: txn.amount,
        status: txn.status,
        provider: txn.provider
    }));
}

export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F111A] tracking-tight">
                        Transfer & Deposits
                    </h1>
                    <p className="text-xs sm:text-sm text-[#646A79] mt-1">
                        Add funds instantly via NetBanking and monitor your on-ramp transaction status.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F2EFFF] text-[#5844ED] border border-[#5844ED]/20">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Instant NetBanking
                    </span>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 w-full">
                    <AddMoney />
                </div>
                <div className="lg:col-span-6 w-full space-y-6">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
