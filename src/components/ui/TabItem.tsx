import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const tabVariants = cva(
  "w-14 h-14 flex items-center justify-center rounded-lg font-bold text-xl transition-all cursor-pointer",
  {
    variants: {
      state: {
        inactive:
          "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 sacle-90",
        active: "bg-orange-400 text-white shadow-md scale-110",
        completed: "bg-green-500 text-white",
        failed: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

interface TabItemProps extends VariantProps<typeof tabVariants> {
  index: number;
  onClick: () => void;
  className?: string;
}

export function TabItem({ index, state, onClick, className }: TabItemProps) {
  return (
    <button
      className={cn(tabVariants({ state }), className)}
      onClick={onClick}
    >
      {index + 1}
    </button>
  );
}
