import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#5494DA] text-white shadow-md hover:bg-[#4783C4]", // Primary color & hover effect
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700",
        outline:
          "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900",
        secondary:
          "bg-gray-800 text-white shadow-md hover:bg-gray-900",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-[#5494DA] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3", // Adjusted default size
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-lg px-10", // Larger button size
        icon: "h-12 w-12", // Bigger icon button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
