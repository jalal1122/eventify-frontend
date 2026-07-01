import { AdminClaim } from "@/types/admin";
import { useState } from "react";
import { X, Scale } from "lucide-react";

interface ResolveClaimModalProps {
  claim: AdminClaim | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (
    claimId: string,
    decision: "approved" | "rejected",
    explanation?: string,
  ) => Promise<void>;
}

export function ResolveClaimModal({
  claim,
  isOpen,
  onClose,
  onResolve,
}: ResolveClaimModalProps) {
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !claim) return null;

  const handleAction = async (decision: "approved" | "rejected") => {
    setIsSubmitting(true);
    try {
      await onResolve(claim._id, decision, explanation);
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
            <Scale className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Resolve Organizer Claim
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Claimed Event
              </h3>
              <p className="text-sm font-medium text-gray-900">
                {claim.eventId?.title || "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Claimant Email
              </h3>
              <p className="text-sm text-gray-900">
                {claim.requesterId?.email || "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Date Submitted
              </h3>
              <p className="text-sm text-gray-900">
                {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <p className="text-sm text-gray-900 capitalize">{claim.status}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="explanation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Decision Explanation
            </label>
            <textarea
              id="explanation"
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the reasoning to the claimant..."
              className="w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => handleAction("rejected")}
            disabled={isSubmitting}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            Reject Claim
          </button>
          <button
            onClick={() => handleAction("approved")}
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            Approve & Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
