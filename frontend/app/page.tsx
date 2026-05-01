"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import TextPrompt from "@/components/TextPrompt";
import { segmentImage } from "@/services/api";
import SegmentationResult from "@/components/SegmentationResult";

export default function HomePage() {
  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [maskBase64, setMaskBase64] = useState("");
  const [overlayBase64, setOverlayBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(0.5);
  const handleImageLoad = (base64: string, preview: string) => {
    setImageBase64(base64);
    setPreviewUrl(preview);
    setMaskBase64("");
    setOverlayBase64("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!imageBase64 || !prompt.trim()) return;
    setLoading(true);
    setError("");
    setMaskBase64("");
    setOverlayBase64("");

    try {
      const res = await segmentImage({
        image_base64: imageBase64,
        prompt,
        threshold,
      });
      setMaskBase64(res.mask_base64);
      setOverlayBase64(res.overlay_base64);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">CLIPSeg Demo</h1>
      <ImageUpload onImageLoad={handleImageLoad} />
      <TextPrompt
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        loading={loading}
        threshold={threshold}
        onThresholdChange={setThreshold}
      />
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {maskBase64 && previewUrl && overlayBase64 && (
        <SegmentationResult
          originalUrl={previewUrl}
          maskBase64={maskBase64}
          overlayBase64={overlayBase64}
        />
      )}
    </div>
  );
}
