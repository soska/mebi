import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const slotVariants = cva(
  "w-20 h-24 text-4xl flex items-center justify-center font-grandstander font-bold rounded border-2 transition-all duration-300 select-none",
  {
    variants: {
      state: {
        hidden:
          "bg-black/50 dark:bg-gray-700 border-white/10 dark:border-gray-600",
        revealed:
          "bg-white dark:bg-gray-800 border-blue-500",
        correct:
          "bg-green-600 dark:bg-green-900 border-green-500 text-green-100 dark:text-green-300",
        wrong:
          "bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300",
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

export function BoardLetterSlot({
  letter,
  isRevealed,
  state,
  className,
}: BoardLetterSlotProps) {
  const displayState = isRevealed ? (state ?? "revealed") : "hidden";

  return (
    <div
      className={cn(
        slotVariants({ state: displayState }),
        isRevealed && "animate-flip",
        className
      )}
    >
      <span
        className={cn(
          "transition-opacity duration-150",
          isRevealed ? "opacity-100" : "opacity-0"
        )}
      >
        {letter}
      </span>
    </div>
  );
}
