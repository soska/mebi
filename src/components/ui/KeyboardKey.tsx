import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const keyVariants = cva(
  "min-w-[2rem] h-10 sm:min-w-[2.5rem] sm:h-12 flex items-center justify-center rounded font-bold text-lg transition-all",
  {
    variants: {
      state: {
        available:
          "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer active:scale-95",
        correct: "bg-green-500 text-white cursor-default",
        wrong: "bg-red-400 text-white cursor-default opacity-60",
        disabled:
          "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "available",
    },
  }
);

interface KeyboardKeyProps extends VariantProps<typeof keyVariants> {
  letter: string;
  onClick: () => void;
  className?: string;
}

export function KeyboardKey({
  letter,
  state,
  onClick,
  className,
}: KeyboardKeyProps) {
  return (
    <button
      className={cn(keyVariants({ state }), className)}
      onClick={onClick}
      disabled={state !== "available"}
    >
      {letter}
    </button>
  );
}
