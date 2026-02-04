import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const slotVariants = cva(
  "w-[var(--board-slot-w)] h-[var(--board-slot-h)] text-[length:var(--board-font)] flex items-center justify-center font-grandstander font-bold rounded border-2 transition-all duration-300 select-none",
  {
    variants: {
      state: {
        hidden:
          "bg-black/30 border-white/10 text-white/25",
        revealed:
          "bg-white dark:bg-gray-800 border-blue-500",
      },
    },
    defaultVariants: {
      state: "hidden",
    },
  }
);

interface BoardLetterSlotProps extends VariantProps<typeof slotVariants> {
  letter: string;
  isRevealed: boolean;
  className?: string;
}

export function BoardSymbolSlot({
  letter,
  isRevealed,
  className,
}: BoardLetterSlotProps) {
  const displayState = isRevealed ? "revealed" : "hidden";

  return (
    <div
      className={cn(
        slotVariants({ state: displayState }),
        className
      )}
    >
      <span
        className={cn(
          "duration-150",
        )}
      >
        {letter}
      </span>
    </div>
  );
}
