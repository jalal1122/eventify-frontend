import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventCardDate(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  // Example: "Sat, Oct 14 • 8:00 PM"
  return format(d, "EEE, MMM d • h:mm a");
}

export function formatShortDate(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  // Example: "Oct 14, 2023"
  return format(d, "MMM d, yyyy");
}
