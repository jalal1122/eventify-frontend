import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  href?: string;
  isActive?: boolean;
  className?: string;
}

export function CategoryBadge({ name, href, isActive, className }: CategoryBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 border",
        isActive 
          ? "border-[#006782] bg-[#006782] text-white shadow-sm" 
          : "border-[#D1D5DB] bg-white text-gray-700 hover:border-[#006782] hover:text-[#006782] hover:bg-white hover:shadow-sm",
        className
      )}
    >
      {name}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
