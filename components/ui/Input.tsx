"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { Search, X } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, icon, onClear, value, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <label className="text-sm font-black uppercase tracking-wider text-black">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black">
              <Search size={20} strokeWidth={3} />
            </div>
          )}
          <input
            ref={ref}
            value={value}
            className={`brutal-input w-full p-4 ${icon ? "pl-12" : "pl-4"} pr-10 ${className}`}
            {...props}
          />
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:bg-black/10 p-1 bg-white border-2 border-black"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
