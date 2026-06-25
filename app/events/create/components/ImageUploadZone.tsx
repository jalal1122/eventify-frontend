"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import ImageCropModal from "./ImageCropModal";
import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";

export default function ImageUploadZone() {
  const { setValue, watch } = useFormContext<EventFormValues>();
  const coverImage = watch("coverImage");
  
  const [isDragging, setIsDragging] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImageSrc(e.target?.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    // Save the final cropped image to the form state
    setValue("coverImage", croppedImageUrl, { shouldValidate: true, shouldDirty: true });
    setRawImageSrc(null); // Clear raw
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("coverImage", undefined, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <div
        className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden ${
          isDragging ? "border-[#006782] bg-[#F0F8FA]" : "border-gray-300 bg-slate-50 hover:bg-slate-100"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !coverImage && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {coverImage ? (
          <div className="absolute inset-0 w-full h-full group">
            <img src={coverImage} alt="Event Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm mr-2 shadow-sm hover:bg-gray-50"
               >
                 Replace Image
               </button>
               <button 
                onClick={removeImage}
                className="bg-red-50 text-red-600 p-2 rounded-lg shadow-sm hover:bg-red-100"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-6 pointer-events-none">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-gray-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#001F29] text-lg">Upload Event Banner</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Drag & drop your image here, or browse.</p>
            <p className="text-xs text-gray-400">Recommended size: 2160 x 1080px (2:1 ratio). Max size: 5MB.</p>
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {rawImageSrc && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setRawImageSrc(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          imageSrc={rawImageSrc}
          onCropCompleteAction={handleCropComplete}
        />
      )}
    </div>
  );
}

