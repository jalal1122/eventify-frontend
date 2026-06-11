"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authApi } from "@/lib/api";
import { tokenStore } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const { refresh } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setError(null);
      // Backend automatically logs the user in and returns { token, user } on register
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      await refresh();
      router.push("/discover");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join to discover and book local events seamlessly."
      type="signup"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <Input 
            {...register("name")}
            placeholder="John Doe" 
            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
        </div>

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
          <Input 
            {...register("password")}
            type="password" 
            placeholder="Create a password (min 8 characters)" 
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
          {isSubmitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <div className="my-8 flex items-center justify-center space-x-4">
        <div className="h-[1px] flex-1 bg-gray-200" />
        <span className="text-sm text-gray-500 font-medium">OR</span>
        <div className="h-[1px] flex-1 bg-gray-200" />
      </div>

      <GoogleButton />

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-semibold text-[#006782] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
