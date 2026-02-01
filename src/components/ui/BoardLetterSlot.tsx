import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const slotVariants = cva(
  "w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold rounded border-2 transition-all duration-300",
  {
    variants: {
      state: {
        hidden:
          "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
        revealed:
          "bg-white dark:bg-gray-800 border-blue-500",
        correct:
          "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300",
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
