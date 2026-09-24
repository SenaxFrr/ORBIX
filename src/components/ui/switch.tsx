import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  id,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full bg-surface-2 shadow-[var(--shadow-border)] transition-colors",
        "data-[state=checked]:bg-accent",
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-6 translate-x-0.5 rounded-full bg-fg transition-transform duration-150",
          "data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-accent-fg",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
