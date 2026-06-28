"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { organizerApi, eventsApi, registrationsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { type Registration } from "@/types/api";
import { Loader2, ArrowLeft, CheckCircle, XCircle, Search, Mail, Receipt, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatShortDate } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function EventApprovalsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending_review" | "approved" | "rejected">("all");

  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const [rejectionReasonOption, setRejectionReasonOption] = useState<string>("Receipt blurry or unreadable");
  const [customRejectionReason, setCustomRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          eventsApi.getById(eventId),
          organizerApi.getEventAttendees(eventId)
        ]);
        setEvent(eventRes.data.event);
        setAllRegistrations(attendeesRes.data.attendees);
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
      
      let finalReason = "";
      if (status === "rejected") {
        if (rejectionReasonOption === "Other (Please specify)") {
          if (!customRejectionReason.trim()) {
            alert("Please specify the rejection reason.");
            setIsSubmitting(false);
            return;
          }
          finalReason = customRejectionReason;
        } else {
          finalReason = rejectionReasonOption;
        }
      }

      await registrationsApi.reviewRegistration(selectedReg._id, { 
        status, 
        rejectionReason: status === "rejected" ? finalReason : undefined 
      });

      // Update in list
      setAllRegistrations(prev => prev.map(r => 
        r._id === selectedReg._id ? { ...r, paymentStatus: status } : r
      ));
      
      setIsReviewModalOpen(false);
      setIsRejecting(false);
      setCustomRejectionReason("");
      setRejectionReasonOption("Receipt blurry or unreadable");
    } catch (error: any) {
      alert(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRegistrations = allRegistrations.filter(r => {
    const matchesSearch = (r.guestDetails?.name || (r.userId as any)?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : r.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusPill = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none shadow-none text-xs px-2.5 py-0.5 font-bold">Pending</Badge>;
      case "approved":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none text-xs px-2.5 py-0.5 font-bold">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none text-xs px-2.5 py-0.5 font-bold">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none shadow-none text-xs px-2.5 py-0.5 font-bold capitalize">{status.replace("_", " ")}</Badge>;
    }
  };

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

  const pendingCount = allRegistrations.filter(r => r.paymentStatus === "pending_review").length;

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
          <p className="text-gray-500 font-medium mt-1">{event.title} • {pendingCount} Pending</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by name..." 
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 w-full focus-visible:ring-[#006782]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" className="h-12 w-full sm:w-auto rounded-2xl border-gray-200 bg-white shadow-sm flex items-center justify-between gap-3 px-4 font-semibold text-gray-700">
                  Status: {statusFilter === "all" ? "All" : statusFilter.replace("_", " ")}
                  <ChevronDown size={16} className="text-gray-400" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-48 z-50 animate-in fade-in zoom-in-95">
                  {[
                    { value: "all", label: "All Statuses" },
                    { value: "pending_review", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ].map(option => (
                    <DropdownMenu.Item 
                      key={option.value}
                      className="px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-50 outline-none flex items-center justify-between"
                      onSelect={() => setStatusFilter(option.value as any)}
                    >
                      {option.label}
                      {statusFilter === option.value && <CheckCircle size={16} className="text-[#006782]" />}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              No registrations found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-6">Attendee Name</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Registration Date</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((reg) => {
                  const name = reg.guestDetails?.name || (reg.userId as any)?.name || "Unknown";
                  const email = reg.guestDetails?.email || (reg.userId as any)?.email || "Unknown";
                  
                  return (
                    <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#006782]/10 text-[#006782] flex items-center justify-center font-bold shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail size={14} />
                          <span className="text-sm font-medium">{email}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        {getStatusPill(reg.paymentStatus || "")}
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-medium text-gray-900">{formatShortDate(reg.createdAt)}</span>
                      </td>
                      <td className="p-6 text-right">
                        {reg.paymentStatus === "pending_review" ? (
                          <Button 
                            onClick={() => {
                              setSelectedReg(reg);
                              setIsReviewModalOpen(true);
                              setIsRejecting(false);
                            }}
                            className="bg-[#006782] hover:bg-[#00556b] text-white rounded-xl px-5 shadow-sm font-semibold text-sm"
                          >
                            Review Approval
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSelectedReg(reg);
                              setIsReviewModalOpen(true);
                              setIsRejecting(false);
                            }}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-5 font-semibold text-sm"
                          >
                            View Details
                          </Button>
                        )}
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
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F9FAFB] rounded-[2rem] shadow-2xl w-full max-w-2xl z-50 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 rounded-t-[2rem] shrink-0">
              <Dialog.Title className="text-xl font-black text-gray-900">Review Approval</Dialog.Title>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {selectedReg && (
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* User Info Card */}
                <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#006782]/10 text-[#006782] flex items-center justify-center text-lg font-black shrink-0">
                      {(selectedReg.guestDetails?.name || (selectedReg.userId as any)?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedReg.guestDetails?.name || (selectedReg.userId as any)?.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{selectedReg.guestDetails?.email || (selectedReg.userId as any)?.email}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusPill(selectedReg.paymentStatus || "")}
                  </div>
                </div>

                {!isRejecting ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Details Column */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                          <Receipt size={18} className="text-gray-400" />
                          Order Details
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <span className="text-sm font-medium text-gray-500">Ticket Type</span>
                            <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                              {selectedReg.ticketId ? "General Admission" : "Free Entry"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <span className="text-sm font-medium text-gray-500">Submitted On</span>
                            <span className="text-sm font-bold text-gray-900">{formatShortDate(selectedReg.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Expected Payment</span>
                            <span className="text-lg font-black text-emerald-600">
                              {selectedReg.ticketId ? (
                                (() => {
                                  const ticket = event?.tickets?.find(t => t.id === selectedReg.ticketId);
                                  return ticket?.price ? `$${ticket.price}` : "Paid";
                                })()
                              ) : "Free"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedReg.customAnswers && Object.keys(selectedReg.customAnswers).length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                          <h4 className="font-bold text-gray-900 mb-2">Form Answers</h4>
                          {Object.entries(selectedReg.customAnswers).map(([q, a]) => (
                            <div key={q} className="pb-3 last:pb-0 last:border-0 border-b border-gray-50">
                              <p className="text-xs font-semibold text-gray-500 mb-1">{q}</p>
                              <p className="text-sm font-bold text-gray-900">{String(a)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Payment Screenshot Column */}
                    <div>
                      {selectedReg.paymentScreenshotUrl ? (
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
                          <h4 className="font-bold text-gray-900 mb-3">Payment Screenshot</h4>
                          <div className="rounded-xl border border-gray-200 overflow-hidden flex-1 bg-gray-50 flex items-center justify-center">
                            <img 
                              src={selectedReg.paymentScreenshotUrl} 
                              alt="Payment Proof" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex items-center justify-center text-center">
                          <div className="text-gray-400">
                            <Receipt size={40} className="mx-auto mb-2 opacity-50" />
                            <p className="font-medium text-sm">No payment screenshot required</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select reason for rejection</h3>
                    
                    <div className="space-y-3 mb-6">
                      {[
                        "Receipt blurry or unreadable",
                        "Payment amount incorrect",
                        "Fake Receipt Uploaded",
                        "Other (Please specify)"
                      ].map((reason) => (
                        <label key={reason} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input 
                            type="radio" 
                            name="rejectionReason" 
                            className="w-5 h-5 text-red-600 focus:ring-red-500" 
                            checked={rejectionReasonOption === reason}
                            onChange={() => setRejectionReasonOption(reason)}
                          />
                          <span className="font-semibold text-gray-700">{reason}</span>
                        </label>
                      ))}
                    </div>

                    {rejectionReasonOption === "Other (Please specify)" && (
                      <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <textarea
                          className="w-full h-24 p-4 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none font-medium text-gray-900"
                          placeholder="Please enter the specific reason..."
                          value={customRejectionReason}
                          onChange={(e) => setCustomRejectionReason(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            {selectedReg?.paymentStatus === "pending_review" && (
              <div className="p-6 bg-white border-t border-gray-100 rounded-b-[2rem] shrink-0">
                {!isRejecting ? (
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 font-bold text-base"
                      onClick={() => setIsRejecting(true)}
                      disabled={isSubmitting}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-base shadow-md"
                      onClick={() => handleReviewAction("approved")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Approve"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-xl font-bold border-gray-200 text-gray-700"
                      onClick={() => setIsRejecting(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                      onClick={() => handleReviewAction("rejected")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Send Rejection Notice"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
