import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";


const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-bold font-grandstander transition-al duration-160l focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 text-shadow-md active:scale-97 active:shadow-lg active:text-shadow-sm active:translate-y-0.5 active:duration-100 ",
  {
    variants: {
      variant: {
        primary: "bg-green-600 text-white hover:bg-blue-700 shadow-lg",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-black/10 hover:bg-black/20 text-white/70 hover:text-white/80",
      },
      size: {
        sm: "py-3 px-5 text-xl ",
        md: "py-4 px-6 text-xl",
        lg: "py-6 px-9 text-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";
