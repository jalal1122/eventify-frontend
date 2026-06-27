"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { organizerApi, eventsApi, registrationsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { type Registration } from "@/types/api";
import { Loader2, ArrowLeft, CheckCircle, XCircle, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatShortDate } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

export default function EventApprovalsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          eventsApi.getById(eventId),
          organizerApi.getEventAttendees(eventId)
        ]);
        setEvent(eventRes.data.event);
        setRegistrations(attendeesRes.data.attendees.filter((r: Registration) => r.paymentStatus === "pending_review"));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleReviewAction = async (status: "approved" | "rejected") => {
    if (!selectedReg) return;
    try {
      setIsSubmitting(true);
      await registrationsApi.reviewRegistration(selectedReg._id, { 
        status, 
        rejectionReason: status === "rejected" ? rejectionReason : undefined 
      });
      // Remove from pending list
      setRegistrations(prev => prev.filter(r => r._id !== selectedReg._id));
      setIsReviewModalOpen(false);
      setIsRejecting(false);
      setRejectionReason("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const name = r.guestDetails?.name || (r.userId as any)?.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  if (!event) {
    return <div className="p-8">Event not found.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Review Approvals</h1>
          <p className="text-gray-500 font-medium mt-1">{event.title} • {registrations.length} Pending</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by name..." 
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              No pending approvals found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-6 font-bold">Attendee</th>
                  <th className="p-6 font-bold">Date Applied</th>
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((reg) => {
                  const name = reg.guestDetails?.name || (reg.userId as any)?.name || "Unknown";
                  const email = reg.guestDetails?.email || (reg.userId as any)?.email || "Unknown";
                  return (
                    <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#006782] text-white flex items-center justify-center font-bold shrink-0">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{name}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-900 text-sm">{formatShortDate(reg.createdAt)}</p>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                          {reg.ticketId ? "PAID TICKET" : "FREE TICKET"}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <Button 
                          onClick={() => {
                            setSelectedReg(reg);
                            setIsReviewModalOpen(true);
                            setIsRejecting(false);
                            setRejectionReason("");
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6"
                        >
                          Review Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog.Root open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md z-50 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {selectedReg && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} />
                  </div>
                  <Dialog.Title className="text-2xl font-black text-gray-900">Review Application</Dialog.Title>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {selectedReg.guestDetails?.name || (selectedReg.userId as any)?.name}
                  </p>
                </div>

                {!isRejecting ? (
                  <div className="space-y-6">
                    {/* Custom Answers */}
                    {selectedReg.customAnswers && Object.keys(selectedReg.customAnswers).length > 0 && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Form Answers</h4>
                        {Object.entries(selectedReg.customAnswers).map(([q, a]) => (
                          <div key={q}>
                            <p className="text-xs font-semibold text-gray-500 mb-1">{q}</p>
                            <p className="text-sm font-bold text-gray-900">{String(a)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Payment Proof */}
                    {selectedReg.paymentScreenshotUrl && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Proof</h4>
                        <div className="rounded-2xl border border-gray-200 overflow-hidden">
                          <img 
                            src={selectedReg.paymentScreenshotUrl} 
                            alt="Payment Proof" 
                            className="w-full h-auto"
                          />  </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => setIsRejecting(true)}
                        disabled={isSubmitting}
                      >
                        <XCircle size={18} className="mr-2" /> Reject
                      </Button>
                      <Button 
                        className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleReviewAction("approved")}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle size={18} className="mr-2" /> Approve</>}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Reason for Rejection (Optional)</label>
                      <textarea
                        className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#006782] outline-none resize-none"
                        placeholder="e.g. Invalid payment proof..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-12 rounded-xl"
                        onClick={() => setIsRejecting(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleReviewAction("rejected")}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Rejection"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
