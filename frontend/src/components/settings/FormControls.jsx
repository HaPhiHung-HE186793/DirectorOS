import React from 'react';

/**
 * Shared Form Label Component for consistent settings UI
 */
export const FormLabel = ({ children, required, extraRight }) => (
  <div className="flex items-center justify-between mb-1.5">
    <label className="block text-xs font-semibold text-slate-300">
      {children}
      {required && <span className="text-amber-400 ml-1 font-mono">*</span>}
    </label>
    {extraRight && <div>{extraRight}</div>}
  </div>
);

/**
 * Shared Form Input Component with unified DirectorOS styling
 */
export const FormInput = ({ className = '', fontMono = false, ...props }) => (
  <input
    {...props}
    className={`w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition ${
      fontMono ? 'font-mono' : ''
    } ${className}`}
  />
);

/**
 * Shared Form Select Component with unified DirectorOS styling
 */
export const FormSelect = ({ children, className = '', ...props }) => (
  <select
    {...props}
    className={`w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer ${className}`}
  >
    {children}
  </select>
);
