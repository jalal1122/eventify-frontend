"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProfileId: string) => void;
}

export default function CreateOrganizerModal({ isOpen, onClose, onSuccess }: CreateOrganizerModalProps) {
  const [brandName, setBrandName] = useState("");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setIsLoading(true);
    try {
      const { organizerApi } = await import("@/lib/api");
      const res = await organizerApi.createProfile({
        brandName,
        bio,
        contactEmail,
      });
      
      const newProfileId = res.data.profile._id || res.data.profile.id;
      onSuccess(newProfileId);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-[#001F29]">Create Organizer Page</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Add your organization details to host events.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#001F29] mb-1 block">Brand / Organization Name *</label>
            <Input 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. TechKhwa Prod." 
              className="h-11 border-gray-300 focus-visible:ring-[#006782]"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#001F29] mb-1 block">Contact Email</label>
            <Input 
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. contact@techkhwa.com" 
              className="h-11 border-gray-300 focus-visible:ring-[#006782]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#001F29] mb-1 block">Bio (Optional)</label>
            <Textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell attendees about your organization..." 
              className="border-gray-300 focus-visible:ring-[#006782] min-h-[100px]"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#006782] hover:bg-[#004E63] text-white" disabled={isLoading || !brandName.trim()}>
              {isLoading ? "Creating..." : "Create Page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
