"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "default" | "outline" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", isLoading, children, disabled, ...props }, ref) => {
    
    let baseStyles = "brutal-btn px-6 py-4 flex items-center justify-center gap-2 relative overflow-hidden ";
    
    if (variant === "default") {
      baseStyles += "bg-fuchsia-400 text-black hover:bg-fuchsia-500 ";
    } else if (variant === "outline") {
      baseStyles += "bg-white text-black hover:bg-gray-100 ";
    } else {
      baseStyles += "bg-transparent text-black border-transparent shadow-none hover:bg-black/5 ";
    }

    if (disabled || isLoading) {
      baseStyles += "opacity-70 cursor-not-allowed active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ";
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
