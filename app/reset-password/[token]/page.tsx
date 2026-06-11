"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authApi } from "@/lib/api";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setError(null);
      await authApi.resetPassword(token, data.password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Invalid or expired token. Please request a new password reset.");
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Reset Successful"
        subtitle="Redirecting you to sign in..."
        type="reset"
      >
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center">
          <p className="text-green-800 font-medium">Your password has been successfully updated.</p>
          <p className="text-sm text-green-600 mt-2">You will be redirected shortly.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter a strong new password for your account."
      type="reset"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <Input 
            {...register("password")}
            type="password" 
            placeholder="Create a new password (min 8 characters)" 
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <Input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="Confirm your new password" 
            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
