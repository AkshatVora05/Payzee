"use client";

import { ReactNode } from "react";

export const AuthCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <a href="/" className="flex items-center gap-2.5 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#5844ED] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0F111A]">
            Payzee
          </span>
        </a>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F111A]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-[#646A79] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-5">
          {children}
        </div>
      </div>

      {/* Trust & Security footer notice */}
      <div className="mt-8 text-center text-xs text-[#8A909F] flex items-center gap-1.5">
        <svg className="w-4 h-4 text-[#5844ED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>End-to-end encrypted bank-grade security</span>
      </div>
    </div>
  );
};
