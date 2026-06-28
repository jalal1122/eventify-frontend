import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface GuestRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export function GuestRegistrationModal({ isOpen, onClose, eventId }: GuestRegistrationModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-2">Almost there!</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            How would you like to continue with your registration?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 mt-2">
          <Button 
            className="w-full h-14 rounded-2xl bg-[#006782] hover:bg-[#004E63] text-white text-base font-bold shadow-md shadow-[#006782]/20"
            onClick={() => router.push(`/auth/signin?callbackUrl=/events/${eventId}/register`)}
          >
            <LogIn className="mr-2 h-5 w-5" /> Log In / Sign Up
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Or</span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-base font-bold"
            onClick={() => router.push(`/events/${eventId}/register`)}
          >
            <UserCheck className="mr-2 h-5 w-5" /> Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
