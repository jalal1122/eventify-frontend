"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventsApi, registrationsApi } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { type Event, type CustomFormField } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, Upload, CheckCircle2, Calendar, MapPin, Ticket, ShieldCheck, FileText } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

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
  const [tosAccepted, setTosAccepted] = useState(false);

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

  // Set user details if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestDetails({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [isAuthenticated, user]);

  const selectedTicket = event?.tickets?.find((t) => t.id === selectedTicketId);

  const handleCustomAnswerChange = async (field: CustomFormField, value: any) => {
    const id = field.fieldId || (field as any)._id || field.label;
    if (field.type === "file" && value instanceof File) {
      setCustomAnswers((prev) => ({ ...prev, [id]: value.name }));
    } else {
      setCustomAnswers((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (!tosAccepted) {
      setError("You must accept the Terms of Service to continue.");
      return;
    }

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
        ...(!isAuthenticated && { guestDetails: { name: guestDetails.name, email: guestDetails.email } }),
      };

      const res = await registrationsApi.register(payload);

      if (res.data.success && paymentProof) {
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

  if (!event || (error && !event)) {
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Sidebar (Dark Theme) */}
      <div className="w-full md:w-[35%] lg:w-[30%] bg-[#0B1521] text-white flex flex-col justify-between p-8 md:min-h-screen">
        <div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black tracking-tight text-white">Eventify</h2>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className="mb-8">
            <p className="text-[#00B4D8] font-bold text-xs tracking-wider uppercase mb-3">Event Summary</p>
            {event.bannerUrl || event.cardImageUrl ? (
              <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 bg-gray-800">
                <img src={event.bannerUrl || event.cardImageUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
              </div>
            ) : null}
            <h3 className="text-3xl font-bold mb-4 leading-tight">{event.title}</h3>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-3 text-gray-300">
                <Calendar size={18} className="mt-0.5 text-[#00B4D8]" />
                <div>
                  <p className="font-semibold text-white">Date & Time</p>
                  <p className="text-sm">{formatShortDate(event.dateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin size={18} className="mt-0.5 text-[#00B4D8]" />
                <div>
                  <p className="font-semibold text-white">Location</p>
                  <p className="text-sm">{event.venueName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary at Bottom */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-4">Order Summary</p>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-[#00B4D8]" />
              <span className="font-semibold">{selectedTicket?.name || "Standard Ticket"}</span>
            </div>
            <span className="font-medium text-gray-300">1x</span>
          </div>
          <div className="w-full h-px bg-white/10 my-4" />
          <div className="flex justify-between items-end">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-3xl font-black text-white">
              {selectedTicket?.type === "FREE" ? "Free" : `Rs ${selectedTicket?.price || 0}`}
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel (Light Theme) */}
      <div className="w-full md:w-[65%] lg:w-[70%] p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-8">Complete Registration</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 border border-red-100 text-sm font-medium flex items-start gap-3">
              <ShieldCheck className="shrink-0 mt-0.5" size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ticket Selection (only if multiple) */}
            {event.tickets && event.tickets.length > 1 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Ticket size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Select Ticket</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedTicketId === ticket.id
                          ? "border-[#006782] bg-[#F0F7F9]"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900">{ticket.name}</span>
                        {selectedTicketId === ticket.id && (
                          <CheckCircle2 size={18} className="text-[#006782]" />
                        )}
                      </div>
                      <p className="text-[#006782] font-black text-xl mb-1">
                        {ticket.type === "FREE" ? "Free" : `Rs ${ticket.price}`}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Capacity: {ticket.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 1: Your Details */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">1. Your Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    readOnly={isAuthenticated}
                    className={`h-12 rounded-xl ${isAuthenticated ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    value={guestDetails.name}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-bold">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    type="email"
                    required
                    readOnly={isAuthenticated}
                    className={`h-12 rounded-xl ${isAuthenticated ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Event Requirements */}
            {event.customFormSchema && event.customFormSchema.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">2. Event Requirements</h3>
                </div>
                <div className="space-y-6">
                  {event.customFormSchema.map((field) => {
                    const id = field.fieldId || (field as any)._id || field.label;
                    return (
                    <div key={id} className="space-y-2">
                      <Label className="text-gray-700 font-bold">
                        {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                      </Label>

                      {(field.type === "SHORT_ANSWER" || field.type === "text") && (
                        <Input
                          required={field.isRequired}
                          className="h-12 rounded-xl bg-gray-50 border-gray-200"
                          value={(customAnswers[id] as string) || ""}
                          onChange={(e) => handleCustomAnswerChange(field, e.target.value)}
                        />
                      )}

                      {field.type === "LONG_ANSWER" && (
                        <Textarea
                          required={field.isRequired}
                          className="min-h-[100px] rounded-xl bg-gray-50 border-gray-200 resize-y p-3"
                          value={(customAnswers[id] as string) || ""}
                          onChange={(e) => handleCustomAnswerChange(field, e.target.value)}
                        />
                      )}

                      {(field.type === "MULTIPLE_CHOICE" || field.type === "select") && field.options && (
                        <select
                          required={field.isRequired}
                          className="w-full h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006782]"
                          value={(customAnswers[id] as string) || ""}
                          onChange={(e) => handleCustomAnswerChange(field, e.target.value)}
                        >
                          <option value="" disabled>Select an option</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {(field.type === "FILE_UPLOAD" || field.type === "file") && (
                        <div className="mt-2 relative">
                          <Input
                            type="file"
                            required={field.isRequired}
                            className="file:bg-[#006782] file:text-white file:border-0 file:rounded-lg file:px-4 file:py-1.5 file:mr-4 file:font-semibold file:text-xs text-sm h-auto py-2.5 rounded-xl border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleCustomAnswerChange(field, e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Card 3: Payment Verification */}
            {selectedTicket?.type === "PAID" && (
              <div className="bg-white border border-[#006782]/20 rounded-3xl p-8 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#006782]/10 text-[#006782] flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {event.customFormSchema && event.customFormSchema.length > 0 ? "3" : "2"}. Payment Verification
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <span className="text-gray-600 font-medium">Amount Due</span>
                    <span className="text-2xl font-black text-gray-900">PKR {selectedTicket.price}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700">Please transfer to:</p>
                    <p className="text-sm text-gray-600 flex justify-between">
                      <span>Account Type:</span> <span className="font-bold text-gray-900">{selectedTicket.paymentAccountType || "Bank Transfer"}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex justify-between">
                      <span>Account No:</span> <span className="font-bold text-gray-900 tracking-wider">{selectedTicket.paymentAccountNumber || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-bold">Upload Payment Screenshot <span className="text-red-500">*</span></Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${paymentProof ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}
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
                        <CheckCircle2 className="text-green-500 w-10 h-10" />
                        <span className="text-sm font-bold text-green-700">{paymentProof.name}</span>
                        <span className="text-xs text-green-600 font-medium">Click to replace</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-700 block">Click to upload screenshot</span>
                          <span className="text-xs font-medium text-gray-400">JPG, PNG up to 5MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer / Actions */}
            <div className="pt-8">
              <div className="flex items-start space-x-3 mb-8">
                <Checkbox
                  id="terms"
                  checked={tosAccepted}
                  onCheckedChange={(checked) => setTosAccepted(checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-700 leading-tight cursor-pointer"
                  >
                    I agree to the Eventify Terms of Service and Privacy Policy
                  </label>
                  <p className="text-sm text-gray-500">
                    Your data will be shared with the event organizer.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !tosAccepted}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-[#006782] hover:bg-[#004E63] text-white shadow-xl shadow-[#006782]/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Registration...
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
