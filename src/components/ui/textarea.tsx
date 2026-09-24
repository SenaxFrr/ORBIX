import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-lg bg-surface-2 px-4 py-3 text-base text-fg shadow-[var(--shadow-border)] placeholder:text-subtle",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
