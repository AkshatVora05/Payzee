import { ReactNode } from "react";

export const AuthCard = ({ title, children, subtitle }: { title: string; subtitle?: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-black px-4 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Branding / Logo */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Payzee</span>
      </div>

      <div className="w-full max-w-[400px] p-8 sm:p-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white transition-colors duration-300">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>
        <div className="relative space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};
