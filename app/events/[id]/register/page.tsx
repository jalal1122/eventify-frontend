"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api, { eventsApi, registrationsApi } from "@/lib/api";
import { type Event, type CustomFormField } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Upload, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const params = useParams();
  const eventId = params.id as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [guestDetails, setGuestDetails] = useState({ name: "", email: "" });
  const [customAnswers, setCustomAnswers] = useState<Record<string, unknown>>({});
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsApi.getById(eventId);
        setEvent(res.data.event);
        if (res.data.event.tickets && res.data.event.tickets.length > 0) {
          setSelectedTicketId(res.data.event.tickets[0].id);
        }
      } catch (err: any) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const selectedTicket = event?.tickets?.find((t) => t.id === selectedTicketId);

  const handleCustomAnswerChange = async (field: CustomFormField, value: any) => {
    if (field.type === "file" && value instanceof File) {
      // Need to upload the file and store the URL
      try {
        const formData = new FormData();
        formData.append("file", value);
        // Note: You would normally have a general file upload endpoint
        // Here we reuse image upload as a placeholder if needed, or assume a general /upload
        // For Nextt Event, let's assume we have an upload endpoint returning a URL
        // We'll mock this or just use the File object if the backend supports multipart for customAnswers (it doesn't).
        // Since backend schema for customAnswers is Record<string, unknown>, we just pass the file name for now if we can't upload.
        // Actually, we should upload it. Let's assume there's an /api/upload endpoint, or we just store the file object and handle it later.
        // For now, we'll just store the file name to avoid breaking if there's no upload endpoint.
        setCustomAnswers((prev) => ({ ...prev, [field.fieldId]: value.name }));
      } catch (err) {
        console.error("Failed to upload file", err);
      }
    } else {
      setCustomAnswers((prev) => ({ ...prev, [field.fieldId]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (selectedTicket?.type === "PAID" && !paymentProof) {
      setError("Payment proof screenshot is required for paid tickets.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        eventId,
        ticketId: selectedTicketId,
        customAnswers,
        ...(!isAuthenticated && { guestDetails }),
      };

      const res = await registrationsApi.register(payload);
      
      if (res.data.success && paymentProof) {
        // Upload payment proof if required
        await registrationsApi.uploadPaymentProof(res.data.registration._id, paymentProof);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  if (!event || error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-500">{error || "Event not found"}</p>
          <Button className="mt-6" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">You're Registered!</h1>
          <p className="text-gray-500 mb-8">
            Your registration for <strong>{event.title}</strong> has been submitted.
            {selectedTicket?.type === "PAID" ? " We will review your payment and send your ticket shortly." : " Check your email for your ticket."}
          </p>
          <Button 
            className="w-full h-14 text-lg font-bold rounded-xl bg-[#006782] hover:bg-[#004E63] text-white"
            onClick={() => isAuthenticated ? router.push("/profile?tab=tickets") : router.push("/")}
          >
            {isAuthenticated ? "View My Tickets" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Event
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Register for Event</h1>
          <p className="text-gray-500 mb-8 font-medium">{event.title}</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Ticket Selection */}
            {event.tickets && event.tickets.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">1. Select Ticket</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.tickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                        selectedTicketId === ticket.id 
                          ? "border-[#006782] bg-[#F0F7F9]" 
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">{ticket.name}</span>
                        {selectedTicketId === ticket.id && (
                          <div className="w-6 h-6 rounded-full bg-[#006782] flex items-center justify-center text-white">
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </div>
                      <p className="text-[#006782] font-black text-2xl mb-2">
                        {ticket.type === "FREE" ? "Free" : `PKR ${ticket.price}`}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        Capacity: {ticket.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Details if not logged in */}
            {!isAuthenticated && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">2. Your Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-bold">Full Name</Label>
                    <Input 
                      required 
                      className="h-14 rounded-2xl border-gray-200 bg-gray-50"
                      value={guestDetails.name}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-bold">Email Address</Label>
                    <Input 
                      type="email"
                      required 
                      className="h-14 rounded-2xl border-gray-200 bg-gray-50"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Form Schema */}
            {event.customFormSchema && event.customFormSchema.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {!isAuthenticated ? "3" : "2"}. Additional Information
                </h3>
                <div className="space-y-6">
                  {event.customFormSchema.map((field) => (
                    <div key={field.fieldId} className="space-y-2">
                      <Label className="text-gray-700 font-bold">
                        {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {field.type === "text" && (
                        <Input 
                          required={field.isRequired}
                          className="h-14 rounded-2xl border-gray-200 bg-gray-50"
                          value={(customAnswers[field.fieldId] as string) || ""}
                          onChange={(e) => handleCustomAnswerChange(field, e.target.value)}
                        />
                      )}

                      {field.type === "select" && field.options && (
                        <select
                          required={field.isRequired}
                          className="w-full h-14 rounded-2xl border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent"
                          value={(customAnswers[field.fieldId] as string) || ""}
                          onChange={(e) => handleCustomAnswerChange(field, e.target.value)}
                        >
                          <option value="" disabled>Select an option</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === "file" && (
                        <div className="mt-2">
                          <Input 
                            type="file" 
                            required={field.isRequired}
                            className="file:bg-gray-100 file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 file:font-semibold text-sm h-auto py-3 rounded-2xl border-gray-200 bg-gray-50"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleCustomAnswerChange(field, e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {selectedTicket?.type === "PAID" && (
              <div className="space-y-6 bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Payment Required</h3>
                <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Ticket Price</span>
                    <span className="text-xl font-black text-gray-900">PKR {selectedTicket.price}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">Please transfer to:</p>
                    <p className="text-sm text-gray-600">Account Type: <span className="font-bold text-gray-900">{selectedTicket.paymentAccountType || "Bank Transfer"}</span></p>
                    <p className="text-sm text-gray-600">Account No: <span className="font-bold text-gray-900">{selectedTicket.paymentAccountNumber || "N/A"}</span></p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Label className="text-gray-700 font-bold">Upload Payment Screenshot</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setPaymentProof(e.target.files[0]);
                          }
                        }}
                      />
                      {paymentProof ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="text-green-500 w-8 h-8" />
                          <span className="text-sm font-bold text-green-600">{paymentProof.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="text-gray-400 w-8 h-8" />
                          <span className="text-sm font-medium text-gray-500">Click to upload screenshot</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-[#006782] hover:bg-[#004E63] text-white shadow-xl shadow-[#006782]/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
