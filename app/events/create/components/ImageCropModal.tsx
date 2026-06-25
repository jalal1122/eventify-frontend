"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropCompleteAction: (croppedImage: string, originalImage: string) => void;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropCompleteAction,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedArea);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropCompleteAction(croppedImage, imageSrc);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-white p-0 overflow-hidden border-0 rounded-3xl">
        {/* Brand bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#006782] to-[#004E63]" />
        
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-[#001F29]">Adjust Event Banner</DialogTitle>
          <p className="text-gray-500 text-sm mt-1">Make sure your banner looks great across all devices.</p>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Cropper Area */}
          <div className="flex-1 bg-slate-50 rounded-xl overflow-hidden relative" style={{ height: "400px" }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={2 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="vertical-cover"
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Preview your image</h3>
              <p className="text-xs text-gray-500 mb-4">This is how your banner will appear on the event page and discovery feed.</p>
              
              <div className="bg-slate-200 rounded-lg w-full aspect-[2/1] overflow-hidden relative shadow-sm border border-slate-100 flex items-center justify-center">
                 {croppedArea ? (
                   <img 
                     src={imageSrc} 
                     alt="Live Preview"
                     className="absolute top-0 left-0 max-w-none"
                     style={{
                       width: `${10000 / croppedArea.width}%`,
                       height: `${10000 / croppedArea.height}%`,
                       transform: `translate(-${croppedArea.x}%, -${croppedArea.y}%)`,
                       transformOrigin: 'top left',
                     }}
                   />
                 ) : (
                   <span className="text-xs text-gray-400">Loading Preview...</span>
                 )}
              </div>
            </div>

            <div className="mt-auto">
              <label className="text-xs font-semibold text-gray-600 block mb-2">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex justify-end gap-3 border-t border-gray-100 mt-2">
          <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-600 font-medium">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#006782] hover:bg-[#004E63] text-white font-medium">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Utility function to extract the cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); 
    image.src = url;
  });
}

