"use client";

import { createOnRampTransactions } from "@/app/lib/actions/createOnRampTransactions";
import { Button } from "@repo/ui/Button";
import CardComponent from "@repo/ui/CardComponent";
import PaymentModal from "@repo/ui/PaymentModal";
import Select from "@repo/ui/Select";
import TextInput from "@repo/ui/TextInput";
import { useState } from "react";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com",
  },
  {
    name: "ICICI Bank",
    redirectUrl: "https://infinity.icicibank.com",
  },
  {
    name: "State Bank of India",
    redirectUrl: "https://www.onlinesbi.sbi",
  },
];

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function AddMoney() {
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState<string>(SUPPORTED_BANKS[0]?.name || "");
  const [redirectUrl, setRedirectUrl] = useState<string>(SUPPORTED_BANKS[0]?.redirectUrl || "");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "idle" | "processing" | "success" | "error";
    errorMessage?: string;
  }>({
    isOpen: false,
    status: "idle",
  });

  const handleBankSelect = (bankName: string) => {
    setProvider(bankName);
    const bank = SUPPORTED_BANKS.find((b) => b.name === bankName);
    if (bank) {
      setRedirectUrl(bank.redirectUrl);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    setModalState({ isOpen: true, status: "processing" });

    try {
      await createOnRampTransactions(Number(amount) * 100, provider);
      // Brief delay to allow the 3D coin animation to complete its spin cycle smoothly
      await new Promise((r) => setTimeout(r, 1600));
      setModalState({ isOpen: true, status: "success" });
    } catch (e: any) {
      setModalState({
        isOpen: true,
        status: "error",
        errorMessage: e?.message || "Failed to process bank deposit",
      });
    }
  };

  return (
    <CardComponent
      title="Add Funds"
      subtitle="Instantly deposit money into your Payzee account"
      badge={
        <div className="w-8 h-8 rounded-lg bg-[#F2EFFF] text-[#5844ED] flex items-center justify-center">
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Deposit Amount Input */}
        <TextInput
          label="Deposit Amount"
          type="number"
          min="1"
          step="100"
          placeholder="0.00"
          prefix="₹"
          value={amount}
          onChange={setAmount}
        />

        {/* Quick Amount Suggestion Chips */}
        <div className="flex items-center gap-2">
          {PRESET_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val.toString())}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                amount === val.toString()
                  ? "bg-[#F2EFFF] text-[#5844ED] border-[#5844ED]/30"
                  : "bg-white hover:bg-gray-50 text-[#4B5162] border-gray-200"
              }`}
            >
              +₹{val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Supported Bank Dropdown */}
        <Select
          label="Payment Gateway / NetBanking"
          defaultValue={provider}
          options={SUPPORTED_BANKS.map((bank) => ({
            key: bank.name,
            value: bank.name
          }))}
          onSelect={handleBankSelect}
        />

        {/* Bank Security Guarantee */}
        <div className="p-3 bg-[#F8F9FB] border border-gray-200/80 rounded-xl flex items-center gap-2.5 text-xs text-[#646A79]">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>256-bit encrypted bank gateway. Zero deposit fees.</span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button onClick={handleAddMoney} variant="primary">
            Proceed to {provider || "Bank"}
          </Button>
        </div>
      </div>

      <PaymentModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        amount={amount}
        sourceName={provider || "Bank Account"}
        destinationName="Payzee Wallet"
        errorMessage={modalState.errorMessage}
        onClose={() => setModalState({ isOpen: false, status: "idle" })}
        onSuccessDone={() => {
          setModalState({ isOpen: false, status: "idle" });
          setAmount("");
          window.location.reload();
        }}
      />
    </CardComponent>
  );
}
