"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";

function GoogleButtonInner() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/discover";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      setLoading(true);
      setError(null);
      await googleLogin(credentialResponse.credential);
      router.push(callbackUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleError = () => {
    setError("Google sign-in was unsuccessful");
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full [&>div>div]:w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          shape="rectangular"
          theme="outline"
          size="large"
          text="continue_with"
          width="448"
        />
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      {loading && <p className="text-sm text-gray-500 text-center">Signing you in...</p>}
    </div>
  );
}

export function GoogleButton() {
  return (
    <Suspense fallback={<div>Loading Google Sign-in...</div>}>
      <GoogleButtonInner />
    </Suspense>
  );
}

