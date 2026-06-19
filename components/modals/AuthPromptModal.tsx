"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onSelectGuest: () => void;
}

export default function AuthPromptModal({ open, onClose, onSelectGuest }: AuthPromptModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl bg-white">
        {/* Top Header Section */}
        <div className="bg-[#006782] p-8 text-center text-white relative">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Almost there!</h2>
          <p className="text-[#BAEAFF] font-medium">Please sign in or continue as guest.</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex flex-col gap-4 mb-8">
            <Button 
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl shadow-sm text-base font-bold flex items-center justify-center gap-3 relative overflow-hidden"
              onClick={() => {
                onClose();
                router.push("/auth/signin");
              }}
            >
              {/* Fake Google Icon */}
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">G</div>
              Continue with Google
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button 
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl shadow-sm text-base font-bold flex items-center justify-center gap-3"
              onClick={() => {
                onClose();
                router.push("/auth/signin");
              }}
            >
              <Mail className="text-gray-500" size={20} />
              Continue with Email
            </Button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Guest Checkout</h3>
                <p className="text-gray-500 text-sm">No account needed. Just your email.</p>
              </div>
              <Button 
                variant="ghost" 
                className="rounded-full w-10 h-10 p-0 bg-white border border-gray-200 shadow-sm text-[#006782] hover:bg-gray-50 shrink-0"
                onClick={onSelectGuest}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-medium">
            By proceeding, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
