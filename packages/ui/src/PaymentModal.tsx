"use client";

import React, { useEffect, useState } from "react";

export interface PaymentModalProps {
  isOpen: boolean;
  status: "idle" | "processing" | "success" | "error";
  amount: number | string; // in Rupees (e.g. 500)
  sourceName?: string; // e.g. "HDFC Bank" or "Payzee Wallet"
  destinationName?: string; // e.g. "Payzee Wallet" or "alice@gmail.com"
  errorMessage?: string;
  onClose: () => void;
  onSuccessDone?: () => void;
}

export default function PaymentModal({
  isOpen,
  status,
  amount,
  sourceName = "Bank Account",
  destinationName = "Payzee Wallet",
  errorMessage = "Transaction could not be completed",
  onClose,
  onSuccessDone,
}: PaymentModalProps) {
  const [phaseText, setPhaseText] = useState("Connecting to payment gateway...");

  useEffect(() => {
    if (status !== "processing") return;

    const t1 = setTimeout(() => {
      setPhaseText("Securing bank-grade transaction...");
    }, 900);

    const t2 = setTimeout(() => {
      setPhaseText("Transferring funds...");
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status]);

  if (!isOpen) return null;

  const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const formattedAmount = numAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F111A]/60 backdrop-blur-md animate-fade-in">
      <style>{`
        @keyframes coinFlip3D {
          0% {
            transform: perspective(1000px) rotateY(0deg) translateY(0);
          }
          25% {
            transform: perspective(1000px) rotateY(90deg) translateY(-8px);
          }
          50% {
            transform: perspective(1000px) rotateY(180deg) translateY(0);
          }
          75% {
            transform: perspective(1000px) rotateY(270deg) translateY(-8px);
          }
          100% {
            transform: perspective(1000px) rotateY(360deg) translateY(0);
          }
        }

        @keyframes pulseWave {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes beamFlow {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes checkPop {
          0% {
            transform: scale(0.3) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.15) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-coin-flip {
          animation: coinFlip3D 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-style: preserve-3d;
        }

        .animate-pulse-wave-1 {
          animation: pulseWave 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-wave-2 {
          animation: pulseWave 1.8s cubic-bezier(0, 0, 0.2, 1) infinite 0.6s;
        }

        .animate-beam-dash {
          stroke-dasharray: 6 6;
          animation: beamFlow 0.8s linear infinite;
        }

        .animate-check-pop {
          animation: checkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl border border-gray-100 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#5844ED]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* ----------------- PROCESSING STATE ----------------- */}
        {status === "processing" && (
          <div className="flex flex-col items-center w-full py-2">
            {/* Visual Transfer Pathway (Source -> Coin -> Target) */}
            <div className="flex items-center justify-between w-full px-4 mb-6">
              {/* Source (e.g. Bank) */}
              <div className="flex flex-col items-center gap-1.5 w-20 truncate">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F9FB] border border-gray-200/80 shadow-xs flex items-center justify-center text-[#5844ED] font-bold text-xs">
                  {sourceName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-[#646A79] truncate w-full">
                  {sourceName}
                </span>
              </div>

              {/* Connecting Transfer Pathway Beam */}
              <div className="flex-1 px-2 flex items-center justify-center">
                <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 12">
                  <line
                    x1="0"
                    y1="6"
                    x2="100"
                    y2="6"
                    stroke="#E5E7EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="0"
                    y1="6"
                    x2="100"
                    y2="6"
                    stroke="#5844ED"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-beam-dash"
                  />
                </svg>
              </div>

              {/* Destination (e.g. Payzee / Peer) */}
              <div className="flex flex-col items-center gap-1.5 w-20 truncate">
                <div className="w-11 h-11 rounded-2xl bg-[#F2EFFF] border border-[#5844ED]/20 shadow-xs flex items-center justify-center text-[#5844ED] font-bold text-xs">
                  {destinationName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-[#0F111A] truncate w-full">
                  {destinationName}
                </span>
              </div>
            </div>

            {/* Central 3D Razorpay Gold Coin with Pulse Waves */}
            <div className="relative w-28 h-28 flex items-center justify-center my-4">
              {/* Expanding Pulse Glow Waves */}
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse-wave-1" />
              <div className="absolute inset-0 rounded-full bg-[#5844ED]/20 animate-pulse-wave-2" />

              {/* 3D Shiny Metallic Gold Coin */}
              <div className="relative w-20 h-20 rounded-full animate-coin-flip shadow-[0_10px_25px_rgba(245,158,11,0.45)]">
                {/* Coin Body */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#E67E22] via-[#F39C12] to-[#F1C40F] border-4 border-[#FAD7A0] flex items-center justify-center relative shadow-inner">
                  {/* Subtle coin engraved inner circle */}
                  <div className="w-14 h-14 rounded-full border border-[#D35400]/40 flex items-center justify-center bg-gradient-to-br from-[#F5B041] to-[#E67E22]">
                    <span className="text-2xl font-extrabold text-[#7E3B00] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] select-none">
                      ₹
                    </span>
                  </div>
                  {/* Glossy specular reflection highlight */}
                  <div className="absolute top-1 left-2.5 w-7 h-3 rounded-full bg-white/40 blur-[1px] transform -rotate-45 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Amount Callout */}
            <div className="text-3xl font-bold text-[#0F111A] tracking-tight tabular-nums mt-1">
              ₹{formattedAmount}
            </div>

            {/* Status updates */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5844ED] animate-ping" />
              <span className="text-xs font-semibold text-[#646A79] transition-all">
                {phaseText}
              </span>
            </div>

            <p className="text-[11px] text-[#8A909F] mt-2">
              Please do not close or refresh this window
            </p>
          </div>
        )}

        {/* ----------------- SUCCESS STATE ----------------- */}
        {status === "success" && (
          <div className="flex flex-col items-center w-full py-2 animate-fade-in relative">
            {/* Confetti particles */}
            <div className="absolute inset-x-0 -top-6 h-28 pointer-events-none overflow-hidden">
              <div
                className="absolute top-2 left-6 w-2 h-2 rounded-full bg-emerald-400"
                style={{ animation: "confettiFall 1.6s ease-out infinite 0.1s" }}
              />
              <div
                className="absolute top-1 left-1/4 w-2 h-3 rounded-sm bg-purple-500 transform rotate-45"
                style={{ animation: "confettiFall 1.8s ease-out infinite 0.3s" }}
              />
              <div
                className="absolute top-3 left-1/2 w-2 h-2 rounded-full bg-amber-400"
                style={{ animation: "confettiFall 1.5s ease-out infinite 0.2s" }}
              />
              <div
                className="absolute top-2 right-1/4 w-2.5 h-2 rounded-sm bg-blue-500 transform rotate-12"
                style={{ animation: "confettiFall 1.7s ease-out infinite 0.4s" }}
              />
              <div
                className="absolute top-1 right-8 w-2 h-2 rounded-full bg-pink-400"
                style={{ animation: "confettiFall 1.9s ease-out infinite 0.15s" }}
              />
            </div>

            {/* Pop-in Celebratory Green Checkmark */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center my-3 animate-check-pop shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <svg
                  className="w-8 h-8 stroke-[3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mt-1">
              Transfer Successful
            </span>

            <div className="text-3xl font-extrabold text-[#0F111A] tracking-tight tabular-nums mt-1">
              ₹{formattedAmount}
            </div>

            <p className="text-xs text-[#646A79] mt-1.5 max-w-[240px]">
              Transferred from <strong className="text-[#0F111A]">{sourceName}</strong> to{" "}
              <strong className="text-[#0F111A]">{destinationName}</strong>.
            </p>

            {/* Action Done Button */}
            <button
              type="button"
              onClick={onSuccessDone || onClose}
              className="mt-6 w-full h-11 bg-[#5844ED] hover:bg-[#4C35E0] text-white font-semibold text-sm rounded-xl transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* ----------------- ERROR STATE ----------------- */}
        {status === "error" && (
          <div className="flex flex-col items-center w-full py-2 animate-fade-in">
            {/* Red Alert Icon */}
            <div className="w-18 h-18 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center my-3 shadow-[0_10px_25px_rgba(239,68,68,0.2)]">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm">
                <svg
                  className="w-6 h-6 stroke-[3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-red-600 mt-1">
              Transfer Failed
            </span>

            <p className="text-xs text-[#646A79] mt-2 px-2 leading-relaxed">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full h-11 bg-white hover:bg-gray-50 border border-gray-200 text-[#0F111A] font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
