"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  onImageLoad: (base64: string, previewUrl: string) => void;
}

export default function ImageUpload({ onImageLoad }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ✅ Check 1 — file type
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      alert("Only JPG, PNG, WebP allowed");
      return;
    }

    // ✅ Check 2 — file size
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      // "data:image/png;base64,XXXXX"
      const base64 = result.split(",")[1];

      setPreview(result);
      onImageLoad(base64, result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* File Input */}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp" // ✅ restrict picker too
        onChange={handleFileChange}
      />

      {/* Preview */}
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          className="max-w-sm rounded-lg border"
        />
      )}
    </div>
  );
}