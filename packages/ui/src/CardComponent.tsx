import React, { ReactNode } from "react";

export interface CardComponentProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function CardComponent({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: CardComponentProps) {
  return (
    <div
      className={`bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-gray-300/80 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-[#0F111A] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#646A79] mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div>{children}</div>
    </div>
  );
}
