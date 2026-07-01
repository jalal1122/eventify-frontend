"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { attendeeApi, eventsApi } from "@/lib/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ReportClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export function ReportClaimModal({ isOpen, onClose, eventId }: ReportClaimModalProps) {
  const [mode, setMode] = useState<"report" | "claim">("report");
  const [loading, setLoading] = useState(false);

  // Report State
  const [reason, setReason] = useState("Spam or misleading");
  const [description, setDescription] = useState("");

  // Claim State
  const [proofFile, setProofFile] = useState<File | null>(null);

  const handleClose = () => {
    setReason("Spam or misleading");
    setDescription("");
    setProofFile(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "report") {
        if (!description.trim()) {
          toast.error("Please provide a description.");
          setLoading(false);
          return;
        }
        await attendeeApi.submitReport(eventId, reason, description);
        toast.success("Report submitted successfully. Thank you!");
      } else {
        if (!proofFile) {
          toast.error("Please upload proof of ownership.");
          setLoading(false);
          return;
        }

        const res = await eventsApi.uploadImage(proofFile);
        if (!res.data.success || !res.data.url) {
          throw new Error("Failed to upload image");
        }

        await attendeeApi.submitClaim(eventId, res.data.url);
        toast.success("Claim submitted successfully. Our team will review it.");
      }
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to submit ${mode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold">
              {mode === "report" ? "Report Event" : "Claim Event"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex gap-2 border-b border-gray-200 pb-2 mb-2">
            <button
              type="button"
              onClick={() => setMode("report")}
              className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                mode === "report"
                  ? "border-[#001F29] text-[#001F29]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Report Event
            </button>
            <button
              type="button"
              onClick={() => setMode("claim")}
              className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                mode === "claim"
                  ? "border-[#001F29] text-[#001F29]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Claim Ownership
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "report" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for reporting</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#001F29] focus:outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="Spam or misleading">Spam or misleading</option>
                    <option value="Offensive content">Offensive content</option>
                    <option value="Scam or fraud">Scam or fraud</option>
                    <option value="Intellectual property violation">Intellectual property violation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Please provide details about why you are reporting this event..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    Are you the organizer of this event? Submit a claim with proof of ownership (e.g., an official document, social media screenshot, or business license) to take control of this page.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Proof</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setProofFile(e.target.files[0]);
                      }}
                      required
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      {proofFile ? proofFile.name : "Click or drag file to upload"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 5MB</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#001F29] text-white hover:bg-[#001F29]/90" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
