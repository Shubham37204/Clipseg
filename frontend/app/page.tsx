"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import TextPrompt from "@/components/TextPrompt";
import SegmentationResult from "@/components/SegmentationResult";
import { segmentImage } from "@/services/api";

export default function HomePage() {
  // State
  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [maskBase64, setMaskBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle image load
  const handleImageLoad = (base64: string, preview: string) => {
    setImageBase64(base64);
    setPreviewUrl(preview);
    setMaskBase64(""); // reset previous result
    setError("");
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!imageBase64 || !prompt.trim()) return;

    setLoading(true);
    setError("");
    setMaskBase64("");

    try {
      const res = await segmentImage({
        image_base64: imageBase64,
        prompt: prompt,
      });

      setMaskBase64(res.mask_base64);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">CLIPSeg Demo</h1>

      {/* Image Upload */}
      <ImageUpload onImageLoad={handleImageLoad} />

      {/* Prompt Input */}
      <TextPrompt
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Error */}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {/* Result */}
      {maskBase64 && previewUrl && (
        <SegmentationResult originalUrl={previewUrl} maskBase64={maskBase64} />
      )}
    </div>
  );
}
