"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registrationsApi } from "@/lib/api";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const guestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  onSuccess: () => void;
}

export function GuestCheckoutModal({ open, onClose, eventId, eventName, onSuccess }: GuestCheckoutModalProps) {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
  });

  const onSubmit = async (data: GuestFormValues) => {
    try {
      setError(null);
      await registrationsApi.register({
        eventId,
        guestDetails: {
          name: data.name,
          email: data.email,
        }
      });
      onSuccess();
    } catch (err: any) {
      console.error("Guest registration error", err);
      setError(err.response?.data?.message || "Failed to register as guest.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl bg-white">
        
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-100">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Guest Details</h2>
            <p className="text-xs text-gray-500 font-medium">Step 1 of 2</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-4 items-start">
            <div className="mt-0.5 text-[#006782]">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Registering for</p>
              <p className="text-sm text-gray-600 line-clamp-1">{eventName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
              <Input 
                {...register("name")}
                placeholder="e.g. John Doe" 
                className={`h-14 rounded-xl border-gray-200 bg-gray-50/50 px-4 focus-visible:ring-[#006782] ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.name && <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
              <Input 
                {...register("email")}
                type="email"
                placeholder="e.g. john@example.com" 
                className={`h-14 rounded-xl border-gray-200 bg-gray-50/50 px-4 focus-visible:ring-[#006782] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <p className="mt-2 text-xs text-gray-500 font-medium">Your tickets will be sent to this email address.</p>
              {errors.email && <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.email.message}</p>}
            </div>

            {error && (
              <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-base font-bold bg-[#006782] hover:bg-[#004E63] text-white shadow-md" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue to Review"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
