"use client";

import React, { useState, InputHTMLAttributes, ReactNode, forwardRef } from "react";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "prefix"> {
  label?: string;
  sublabel?: ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  helperText?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  showPasswordToggle?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      sublabel,
      placeholder,
      type = "text",
      value,
      onChange,
      onInputChange,
      error,
      helperText,
      prefix,
      suffix,
      containerClassName = "",
      inputClassName = "",
      disabled = false,
      required = false,
      showPasswordToggle = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
      onInputChange?.(e);
    };

    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${containerClassName}`}>
        {/* Top Label & Optional Sublabel/Action */}
        {(label || sublabel) && (
          <div className="flex justify-between items-center">
            {label && (
              <label className="text-xs font-semibold text-[#323743] uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            {sublabel && <div>{sublabel}</div>}
          </div>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Prefix (e.g. ₹ symbol or leading icon) */}
          {prefix && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[#646A79] font-bold text-sm">
              {prefix}
            </div>
          )}

          {/* Core Input */}
          <input
            ref={ref}
            type={actualType}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`w-full h-12 bg-white rounded-xl text-sm font-semibold text-[#0F111A] placeholder:text-gray-300 placeholder:font-normal outline-none transition-all duration-150 border shadow-xs ${
              type === "number" ? "tabular-nums" : ""
            } ${prefix ? "pl-9" : "px-3.5"} ${
              suffix || (isPassword && showPasswordToggle) ? "pr-11" : "pr-3.5"
            } ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-[#5844ED] focus:ring-4 focus:ring-[#5844ED]/10"
            } ${
              disabled
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : ""
            } ${inputClassName}`}
            {...rest}
          />

          {/* Suffix or Password Visibility Toggle */}
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          ) : suffix ? (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#646A79] text-sm pointer-events-none font-medium">
              {suffix}
            </div>
          ) : null}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="text-xs text-[#646A79] mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
