"use client";

import React from "react";

export interface AppbarProps {
  title?: string;
  portalBadge?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading?: boolean;
  signInLabel?: string;
  signUpLabel?: string;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
  onDashboard?: () => void;
  children?: React.ReactNode;
}

export const Appbar: React.FC<AppbarProps> = ({
  title = "Payzee",
  portalBadge,
  user,
  isLoading = false,
  signInLabel,
  signUpLabel,
  onSignIn,
  onSignUp,
  onSignOut,
  onDashboard,
  children,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-8 h-8 rounded-lg bg-[#5844ED] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg
              className="w-4.5 h-4.5"
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
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#0F111A]">
              {title}
            </span>
            {portalBadge && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F2EFFF] text-[#5844ED] border border-[#5844ED]/15">
                {portalBadge}
              </span>
            )}
          </div>
        </a>

        {/* Right Navigation / Conditional Actions */}
        <div className="flex items-center gap-3">
          {children ? (
            children
          ) : isLoading ? (
            <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* User Identity */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#0F111A] leading-tight">
                  {user.name || "Account"}
                </span>
                <span className="text-[11px] text-[#646A79] max-w-[170px] truncate leading-tight">
                  {user.email}
                </span>
              </div>

              {/* Dashboard Action */}
              {onDashboard && (
                <button
                  type="button"
                  onClick={onDashboard}
                  className="h-9 px-3.5 rounded-lg text-xs font-semibold text-[#0F111A] bg-gray-100 hover:bg-gray-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#5844ED]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </button>
              )}

              {/* Sign out */}
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="h-9 px-3.5 rounded-lg text-xs font-semibold text-[#646A79] hover:text-[#0F111A] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onSignIn && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className={
                    onSignUp
                      ? "h-9 px-3.5 rounded-lg text-xs font-semibold text-[#4B5162] hover:text-[#0F111A] hover:bg-gray-100 transition-colors cursor-pointer"
                      : "h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-xs transition-colors cursor-pointer"
                  }
                >
                  {signInLabel || (onSignUp ? "Sign in" : "Merchant Login")}
                </button>
              )}
              {onSignUp && (
                <button
                  type="button"
                  onClick={onSignUp}
                  className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#5844ED] hover:bg-[#4C35E0] shadow-xs transition-colors cursor-pointer"
                >
                  {signUpLabel || "Get started"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Appbar;
