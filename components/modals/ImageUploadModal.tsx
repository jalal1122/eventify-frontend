import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (url: string) => void;
  type?: "profile" | "event";
}

export default function ImageUploadModal({ open, onClose, onUploadComplete, type }: ImageUploadModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(false);
      onUploadComplete(reader.result as string);
      toast.success("Image uploaded successfully!");
    };
    reader.onerror = () => {
      setLoading(false);
      toast.error("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Image</h2>
          <p className="text-gray-500 mb-6 text-sm">Choose an image from your computer to upload.</p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative">
            <Upload className="w-10 h-10 text-gray-400 mb-4" />
            <span className="font-semibold text-gray-700">Click to browse</span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
            
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          {loading && (
            <div className="mt-4 text-center text-sm font-medium text-[#006782]">
              Processing image...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
