import { X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface AttendeeDetailsPanelProps {
  attendee: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AttendeeDetailsPanel({ attendee, isOpen, onClose }: AttendeeDetailsPanelProps) {
  if (!isOpen || !attendee) return null;

  const name = attendee.guestDetails?.name || attendee.userId?.name || "Unknown";
  const email = attendee.guestDetails?.email || attendee.userId?.email || "Unknown";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "??";
  
  // Status Badge
  let statusLabel = "Free";
  let statusClasses = "bg-blue-50 text-blue-600";
  if (attendee.status === 'cancelled') {
    statusLabel = "Cancelled";
    statusClasses = "bg-gray-100 text-gray-600";
  } else if (attendee.paymentStatus === 'pending_review') {
    statusLabel = "Pending";
    statusClasses = "bg-orange-50 text-orange-600";
  } else if (attendee.paymentStatus === 'approved') {
    statusLabel = "Approved";
    statusClasses = "bg-green-50 text-green-600";
  } else if (attendee.paymentStatus === 'rejected') {
    statusLabel = "Rejected";
    statusClasses = "bg-red-50 text-red-600";
  }

  const isFree = attendee.paymentStatus === 'free';
  const ticketType = isFree ? "General Admission" : "Paid Ticket";
  
  // Check if they are checked in. (If we have qrScanData or checkedIn field)
  const isCheckedIn = !!attendee.qrScanData || attendee.checkedIn;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#006782]/10 flex items-center justify-center text-[#006782] font-black shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{name}</h2>
              <p className="text-sm text-gray-500 mb-2">{email}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${statusClasses}`}>
                  {statusLabel}
                </span>
                <span className="text-xs font-bold text-gray-500">#{attendee.ticketCode || "N/A"}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Ticket Type</p>
                <p className="font-bold text-gray-900">{ticketType}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Order Date</p>
                <p className="font-bold text-gray-900">
                  {attendee.createdAt ? format(new Date(attendee.createdAt), "MMM d, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Amount Paid</p>
                <p className="font-bold text-gray-900">{isFree ? "Free" : "Paid"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Checked In</p>
                <p className={`font-bold ${isCheckedIn ? "text-green-600" : "text-gray-900"}`}>
                  {isCheckedIn ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Data */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Registration Data</h3>
            <div className="space-y-4">
              {attendee.customAnswers && Object.keys(attendee.customAnswers).length > 0 ? (
                Object.entries(attendee.customAnswers).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">{key.replace(/_/g, " ")}</p>
                    <p className="font-medium text-gray-900">{String(val) || "N/A"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 font-medium">No custom registration data collected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            Cancel Ticket
          </Button>
          <Button className="w-full bg-[#006782] hover:bg-[#004E63] text-white">
            Resend Ticket
          </Button>
        </div>
      </div>
    </>
  );
}
