import { AdminReport } from "@/types/admin";
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ResolveReportModalProps {
  report: AdminReport | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (
    reportId: string,
    action: "dismiss" | "warn" | "takedown" | "freeze",
    notes?: string,
  ) => Promise<void>;
}

export function ResolveReportModal({
  report,
  isOpen,
  onClose,
  onResolve,
}: ResolveReportModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report) return null;

  const handleAction = async (
    action: "dismiss" | "warn" | "takedown" | "freeze",
  ) => {
    setIsSubmitting(true);
    try {
      await onResolve(report._id, action, notes);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Resolve Community Report
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
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
            <h3 className="text-sm font-medium text-red-800 mb-1">
              Reported Reason
            </h3>
            <p className="text-sm text-red-700">{report.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Target Event
              </h3>
              <p className="text-sm text-gray-900">
                {report.eventId?.title || "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Reported By
              </h3>
              <p className="text-sm text-gray-900">
                {report.reporterId?.email || "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Date Submitted
              </h3>
              <p className="text-sm text-gray-900">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <p className="text-sm text-gray-900 capitalize">
                {report.status.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resolution Notes (Internal)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context for the action taken..."
              className="w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => handleAction("dismiss")}
            disabled={isSubmitting}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Dismiss (False Alarm)
          </button>
          <button
            onClick={() => handleAction("warn")}
            disabled={isSubmitting}
            className="rounded-md bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-inset ring-amber-300 hover:bg-amber-200 disabled:opacity-50"
          >
            Issue Warning
          </button>
          <button
            onClick={() => handleAction("takedown")}
            disabled={isSubmitting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            Take Down Event
          </button>
          <button
            onClick={() => handleAction("freeze")}
            disabled={isSubmitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
          >
            Freeze Account
          </button>
        </div>
      </div>
    </div>
  );
}
