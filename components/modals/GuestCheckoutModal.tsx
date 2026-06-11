"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registrationsApi } from "@/lib/api";

const guestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  // Note: customAnswers could be added dynamically here if the event has them
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
      <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden p-0">
        <div className="brand-bar w-full" />
        
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Guest Checkout</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Registering for <span className="font-semibold text-gray-900">{eventName}</span> without an account. We'll send your tickets here.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <Input 
                {...register("name")}
                placeholder="John Doe" 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <Input 
                {...register("email")}
                type="email"
                placeholder="Enter your email" 
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
