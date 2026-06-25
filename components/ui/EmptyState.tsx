import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
      <div className="w-16 h-16 bg-[#006782]/10 rounded-full flex items-center justify-center mb-4 text-[#006782]">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm font-medium">{description}</p>
      
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="h-12 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] font-bold text-white">
              {actionLabel}
            </Button>
          </Link>
        ) : onAction ? (
          <Button onClick={onAction} className="h-12 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] font-bold text-white">
            {actionLabel}
          </Button>
        ) : null
      )}
    </div>
  );
}
