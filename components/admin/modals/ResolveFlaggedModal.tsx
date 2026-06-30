import { FlaggedEvent } from "@/types/admin";
import { useState } from "react";
import { X, ShieldAlert } from "lucide-react";

interface ResolveFlaggedModalProps {
  flaggedEvent: FlaggedEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (
    eventId: string,
    action: "dismiss_reports" | "takedown",
  ) => Promise<void>;
}

export function ResolveFlaggedModal({
  flaggedEvent,
  isOpen,
  onClose,
  onResolve,
}: ResolveFlaggedModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !flaggedEvent) return null;

  const handleAction = async (action: "dismiss_reports" | "takedown") => {
    setIsSubmitting(true);
    try {
      await onResolve(flaggedEvent.eventId, action);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Resolve Flagged Event
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div
            className={`rounded-lg p-4 border ${
              flaggedEvent.severity === "CRITICAL"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <h3
              className={`text-sm font-medium mb-1 ${
                flaggedEvent.severity === "CRITICAL"
                  ? "text-red-800"
                  : "text-amber-800"
              }`}
            >
              Severity: {flaggedEvent.severity}
            </h3>
            <p
              className={`text-sm ${
                flaggedEvent.severity === "CRITICAL"
                  ? "text-red-700"
                  : "text-amber-700"
              }`}
            >
              This event has received {flaggedEvent.reportCount} reports
              recently. Please take action to protect the community.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Target Event
            </h3>
            <p className="text-base font-medium text-gray-900">
              {flaggedEvent.event?.title || "Unknown"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status: {flaggedEvent.event?.status}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => handleAction("dismiss_reports")}
            disabled={isSubmitting}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Clear Flags (Safe)
          </button>
          <button
            onClick={() => handleAction("takedown")}
            disabled={isSubmitting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            Take Down Event
          </button>
        </div>
      </div>
    </div>
  );
}
