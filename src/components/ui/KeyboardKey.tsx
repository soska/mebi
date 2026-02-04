import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const keyVariants = cva(
  "min-w-[2rem] h-10 sm:min-w-[2.5rem] sm:h-12 flex items-center justify-center rounded font-bold text-lg transition-all",
  {
    variants: {
      state: {
        available:
          "bg-pink-200 hover:bg-yellow-400 text-purple-800 hover:text-purple-900 hover:shadow-md cursor-pointer active:scale-95 hover:scale-150 duration-100 ease-out",
        correct: "bg-green-500 text-white cursor-default",
        wrong: "bg-red-400 text-white cursor-default opacity-60",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      state: "available",
      disabled: false,
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
  disabled,
  onClick,
  className,
}: KeyboardKeyProps) {
  const isDisabled = disabled ?? false;
  return (
    <button
      className={cn(keyVariants({ state, disabled: isDisabled }), className)}
      onClick={onClick}
      disabled={isDisabled}
    >
      {letter}
    </button>
  );
}
