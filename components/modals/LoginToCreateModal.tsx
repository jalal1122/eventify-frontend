"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginToCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginToCreateModal({ open, onClose }: LoginToCreateModalProps) {
  const router = useRouter();

  const handleAuthNavigation = (path: string) => {
    onClose();
    // Navigate to auth page with a callbackUrl to redirect back to create event page
    router.push(`${path}?callbackUrl=/events/create`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl bg-white">
        {/* Top Header Section */}
        <div className="bg-[#006782] p-8 text-center text-white relative">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Create an Event</h2>
          <p className="text-[#BAEAFF] font-medium">Please log in or create an account to get started.</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex flex-col gap-4 mb-8">
            <Button 
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl shadow-sm text-base font-bold flex items-center justify-center gap-3 relative overflow-hidden"
              onClick={() => handleAuthNavigation("/auth/signin")}
            >
              <Mail className="text-gray-500" size={20} />
              Log In
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button 
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl shadow-sm text-base font-bold flex items-center justify-center gap-3"
              onClick={() => handleAuthNavigation("/auth/signup")}
            >
              <UserPlus className="text-gray-500" size={20} />
              Create an Account
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium mt-6">
            By proceeding, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
