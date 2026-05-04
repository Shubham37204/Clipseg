"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onImageLoad: (base64: string, previewUrl: string) => void;
}

export default function ImageUpload({ onImageLoad }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      alert("Only JPG, PNG, WebP allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
      alert("Image too large. Max 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      onImageLoad(base64, result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all hover:bg-muted/50",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
        
        <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:scale-110 transition-transform shadow-inner shadow-primary/20">
          <Upload className="h-8 w-8" />
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">Click or drag image</p>
          <p className="text-sm text-muted-foreground mt-1">PNG, JPG or WebP (max 10MB)</p>
        </div>

        <Button variant="outline" className="mt-2 rounded-full px-8 pointer-events-none group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          Select Image
        </Button>
      </div>
    </div>
  );
}
