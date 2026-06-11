import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#006782] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#006782] text-white hover:bg-[#004E63]",
        secondary:
          "border-transparent bg-[#F3F4F6] text-gray-900 hover:bg-[#E5E7EB]",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-gray-900 border-[#D1D5DB]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
