"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";

export interface SelectOption {
  key: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  onSelect,
  defaultValue,
  className = "",
  placeholder = "Select an option",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>(
    defaultValue || options[0]?.key || ""
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with defaultValue if it changes
  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelectedKey(defaultValue);
    }
  }, [defaultValue]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.key === selectedKey);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onSelect(key);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-1.5 w-full text-left select-none ${className}`}
    >
      {label && (
        <label className="text-xs font-semibold text-[#323743] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-12 px-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all duration-150 flex items-center justify-between cursor-pointer ${
          isOpen
            ? "border-[#5844ED] ring-4 ring-[#5844ED]/10 shadow-xs"
            : "border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {selectedOption ? (
            <>
              {selectedOption.icon ? (
                <div className="shrink-0">{selectedOption.icon}</div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-[#F2EFFF] border border-[#5844ED]/15 text-[#5844ED] flex items-center justify-center font-bold text-xs shrink-0 tracking-tight">
                  {selectedOption.value.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col text-left truncate">
                <span className="text-sm font-bold text-[#0F111A] truncate">
                  {selectedOption.value}
                </span>
                {selectedOption.subtitle && (
                  <span className="text-[11px] text-[#646A79] truncate">
                    {selectedOption.subtitle}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400 font-normal">
              {placeholder}
            </span>
          )}
        </div>

        {/* Animated Chevron */}
        <div
          className={`shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#5844ED]" : "text-[#646A79]"
          }`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-200/90 rounded-2xl shadow-xl shadow-gray-900/10 p-1.5 space-y-1 max-h-64 overflow-y-auto outline-none transition-all"
        >
          {options.map((option) => {
            const isSelected = option.key === selectedKey;
            return (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-[#F2EFFF] text-[#5844ED]"
                    : "hover:bg-[#F8F9FB] text-[#0F111A]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {option.icon ? (
                    <div className="shrink-0">{option.icon}</div>
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 tracking-tight transition-colors ${
                        isSelected
                          ? "bg-[#5844ED] text-white"
                          : "bg-[#F8F9FB] border border-gray-200/60 text-[#5844ED] group-hover:bg-[#F2EFFF]"
                      }`}
                    >
                      {option.value.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col truncate">
                    <span
                      className={`text-sm tracking-tight truncate ${
                        isSelected
                          ? "font-extrabold text-[#5844ED]"
                          : "font-semibold text-[#0F111A]"
                      }`}
                    >
                      {option.value}
                    </span>
                    {option.subtitle && (
                      <span className="text-[11px] text-[#646A79] truncate mt-0.5">
                        {option.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#5844ED]/10 flex items-center justify-center shrink-0 ml-2">
                    <svg
                      className="w-3.5 h-3.5 text-[#5844ED]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : option.badge ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#646A79] shrink-0 ml-2">
                    {option.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
