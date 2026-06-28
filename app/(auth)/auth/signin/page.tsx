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
  const [showPassword, setShowPassword] = useState(false);

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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Input 
              {...register("password")}
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#006782] focus:ring-[#006782]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link 
            href="/auth/forgot-password"
            className="text-sm font-semibold text-[#006782] hover:underline focus:outline-none"
          >
            Forgot password?
          </Link>
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

