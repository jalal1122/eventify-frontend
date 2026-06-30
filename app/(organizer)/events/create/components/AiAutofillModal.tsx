"use client";

import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X, Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { eventsApi } from "@/lib/api";

interface AiAutofillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFill: (data: any) => void;
}

export default function AiAutofillModal({ isOpen, onClose, onFill }: AiAutofillModalProps) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    setIsLoading(true);
    setError("");
    try {
      let res;
      if (mode === "text") {
        if (!textInput.trim()) throw new Error("Please enter some text.");
        res = await eventsApi.magicFillText(textInput);
      } else {
        if (!imageFile) throw new Error("Please upload an image.");
        res = await eventsApi.magicFillImage(imageFile);
      }

      if (res.data.success) {
        onFill(res.data.data);
        onClose();
        // Reset state
        setTextInput("");
        setImageFile(null);
      } else {
        throw new Error(res.data.message || "Failed to extract details.");
      }
    } catch (err: any) {
      console.error("AI Extraction error:", err);
      setError(err.response?.data?.message || err.message || "An error occurred during extraction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-all" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-[2rem] bg-white p-8 shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Auto-fill with AI
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <Dialog.Description className="text-gray-500 mb-6">
            Paste your event details or upload a promotional poster, and Gemini AI will automatically extract and fill the form for you.
          </Dialog.Description>

          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${mode === "text" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("text")}
            >
              <FileText size={16} /> Text Prompt
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${mode === "image" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("image")}
            >
              <Upload size={16} /> Upload Poster
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {mode === "text" ? (
            <div className="mb-6">
              <Textarea
                placeholder="Paste event description, chat logs, or any unstructured text here..."
                className="min-h-[160px] rounded-2xl bg-gray-50 border-gray-200 resize-none p-4 focus-visible:ring-purple-500"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>
          ) : (
            <div className="mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors h-[160px] flex flex-col items-center justify-center ${
                  imageFile ? "border-purple-300 bg-purple-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                  }}
                />
                {imageFile ? (
                  <>
                    <CheckCircle2 className="text-purple-600 w-8 h-8 mb-2" />
                    <span className="text-sm font-bold text-purple-800">{imageFile.name}</span>
                    <span className="text-xs text-purple-600/80 font-medium mt-1">Click to replace</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400 w-8 h-8 mb-2" />
                    <span className="text-sm font-bold text-gray-700">Click to upload poster</span>
                    <span className="text-xs text-gray-400 font-medium mt-1">JPG, PNG up to 10MB</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-12 px-6 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtract}
              disabled={isLoading || (mode === "text" && !textInput) || (mode === "image" && !imageFile)}
              className="rounded-xl h-12 px-6 font-semibold bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-lg shadow-purple-200"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Extract Details</>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
