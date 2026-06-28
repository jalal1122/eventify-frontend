"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await authApi.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to sign in
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reset password</h1>
          <p className="text-gray-500 font-medium mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Check your email</h3>
              <p className="text-emerald-700 font-medium text-sm">
                We've sent a password reset link to your email address.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  {...register("email")}
                  type="email" 
                  placeholder="you@example.com" 
                  className={`pl-11 h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#006782] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.email.message}</p>}
            </div>

            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-[#006782] hover:bg-[#00556b] text-white font-bold text-base shadow-md" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin mr-2" /> Sending link...</>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
