"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left select-none ${
        selected
          ? "bg-[#F2EFFF] text-[#5844ED] shadow-xs"
          : "text-[#646A79] hover:text-[#0F111A] hover:bg-gray-100/70"
      }`}
    >
      <div className={`transition-colors ${selected ? "text-[#5844ED]" : "text-[#8A909F]"}`}>
        {icon}
      </div>
      <span>{title}</span>
    </button>
  );
};

export default SidebarItem;
