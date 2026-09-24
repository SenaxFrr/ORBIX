import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-lg bg-surface-2 px-4 text-base text-fg shadow-[var(--shadow-border)] placeholder:text-subtle",
        "transition-[box-shadow] duration-150",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
