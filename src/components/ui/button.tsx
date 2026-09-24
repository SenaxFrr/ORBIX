import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "pressable inline-flex items-center justify-center gap-2 font-medium transition-[opacity,background-color,color,box-shadow] duration-150 disabled:opacity-40 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] hover:opacity-95",
        secondary:
          "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface",
        ghost: "bg-transparent text-fg hover:bg-surface-2",
        danger: "bg-danger text-fg hover:opacity-90",
        outline:
          "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
      },
      size: {
        sm: "h-10 px-3 text-sm rounded-md",
        md: "h-12 px-4 text-[15px] rounded-lg",
        lg: "h-14 px-5 text-base rounded-xl",
        icon: "size-12 rounded-lg",
        pill: "h-11 px-4 rounded-full text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
