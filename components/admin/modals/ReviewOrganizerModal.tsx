import { AdminOrganizerProfile } from "@/types/admin";
import { useState } from "react";
import { X } from "lucide-react";

interface ReviewOrganizerModalProps {
  profile: AdminOrganizerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (
    profileId: string,
    decision: "approved" | "rejected",
    reason?: string,
  ) => Promise<void>;
}

export function ReviewOrganizerModal({
  profile,
  isOpen,
  onClose,
  onReview,
}: ReviewOrganizerModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !profile) return null;

  const handleAction = async (decision: "approved" | "rejected") => {
    setIsSubmitting(true);
    try {
      await onReview(profile._id, decision, reason);
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Review Organizer Application
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Brand/Company Name
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {profile.brandName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Owner Name
              </h3>
              <p className="text-sm text-gray-900">
                {profile.ownerId?.name || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Contact Email
              </h3>
              <p className="text-sm text-gray-900">
                {profile.ownerId?.email || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                City/Location
              </h3>
              <p className="text-sm text-gray-900">
                {profile.ownerId?.city || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Applied On
              </h3>
              <p className="text-sm text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Review Notes (Optional)
            </label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Internal notes or rejection reason..."
              className="w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => handleAction("rejected")}
            disabled={isSubmitting}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            Reject Application
          </button>
          <button
            onClick={() => handleAction("approved")}
            disabled={isSubmitting}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Verify Organizer
          </button>
        </div>
      </div>
    </div>
  );
}
