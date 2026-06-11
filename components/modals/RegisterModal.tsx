"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/auth/GoogleButton";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
  eventName: string;
}

export function RegisterModal({ open, onClose, onContinueAsGuest, eventName }: RegisterModalProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, this modal shouldn't ideally be shown (they go straight to checkout),
  // but just in case, we can handle it or just render nothing.
  if (isAuthenticated) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden p-0">
        <div className="brand-bar w-full" />
        
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6 text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">Join to Register</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Create an account to easily access your tickets for <span className="font-semibold text-gray-900">{eventName}</span> and discover more events.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <GoogleButton />
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#F3F4F6]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-semibold">Or continue with email</span>
              </div>
            </div>

            <Button 
              variant="default" 
              className="w-full"
              onClick={() => {
                onClose();
                router.push("/auth/signup");
              }}
            >
              Sign Up with Email
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-[#006782] text-[#006782] hover:bg-[#F8FAFC]"
              onClick={() => {
                onClose();
                router.push("/auth/signin");
              }}
            >
              Sign In
            </Button>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => {
                  onClose();
                  onContinueAsGuest();
                }}
                className="text-sm font-semibold text-gray-500 hover:text-[#006782] transition-colors underline-offset-4 hover:underline"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
