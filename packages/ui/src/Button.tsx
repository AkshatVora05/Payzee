"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "w-full inline-flex items-center justify-center font-semibold text-sm h-11 px-5 rounded-xl transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#5844ED] hover:bg-[#4C35E0] text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5844ED]",
    secondary:
      "bg-white hover:bg-[#F8F9FB] text-[#0F111A] border border-gray-200 hover:border-gray-300 shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400",
    outline:
      "bg-transparent hover:bg-[#F2EFFF] text-[#5844ED] border border-[#5844ED]/30 hover:border-[#5844ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5844ED]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
