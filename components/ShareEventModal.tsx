import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface ShareEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventUrl: string;
}

export function ShareEventModal({ isOpen, onClose, eventTitle, eventUrl }: ShareEventModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${eventTitle} - ${eventUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(eventTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Share Event</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex justify-center gap-4">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
              <WhatsAppIcon />
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <FacebookIcon />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <TwitterIcon />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <LinkedinIcon />
            </a>
            <button onClick={handleCopy} className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors" title="Copy link for Instagram">
              <InstagramIcon />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={eventUrl}
                className="bg-gray-50 border-gray-200 h-12 rounded-xl text-gray-500"
              />
            </div>
            <Button size="icon" className="h-12 w-12 rounded-xl bg-[#006782] hover:bg-[#004E63]" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
