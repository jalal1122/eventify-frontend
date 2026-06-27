"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/discover";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data.email, data.password);
      router.push(callbackUrl);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <Input 
            {...register("email")}
            type="email" 
            placeholder="Enter your email" 
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            {/* The user can request password reset here */}
            <button 
              type="button"
              onClick={() => {
                 // Open forgot password modal or navigate to a dedicated route
                 // For now, let's assume there's a forgot password route
              }}
              className="text-sm font-semibold text-[#006782] hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
          <Input 
            {...register("password")}
            type="password" 
            placeholder="••••••••" 
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="my-8 flex items-center justify-center space-x-4">
        <div className="h-[1px] flex-1 bg-gray-200" />
        <span className="text-sm text-gray-500 font-medium">OR</span>
        <div className="h-[1px] flex-1 bg-gray-200" />
      </div>

      <GoogleButton />

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href={`/auth/signup${callbackUrl !== '/discover' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="font-semibold text-[#006782] hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  return (
    <AuthLayout
      title="Sign in to Eventify"
      subtitle="Welcome back! Please enter your details."
      type="signin"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}

