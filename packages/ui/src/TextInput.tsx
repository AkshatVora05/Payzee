"use client";

interface TextInputProps {
  label: string;
  placeholder: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const TextInput = ({ label, placeholder, type = "text", value, onChange, required = false }: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1.5 focus-within:text-blue-600 dark:focus-within:text-blue-400 text-slate-500 dark:text-zinc-400 transition-colors duration-300">
      <label className="text-[13px] font-semibold ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-inner"
      />
    </div>
  );
};
