"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import TextPrompt from "@/components/TextPrompt";
import CanvasDrawer from "@/components/CanvasDrawer";
import { segmentImage, segmentByImage } from "@/services/api";
import SegmentationResult from "@/components/SegmentationResult";

type Mode = "text" | "image";
type Step = "upload" | "prompt" | "result";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("text");
  const [promptMode, setPromptMode] = useState<"text" | "image">("text");
  const [step, setStep] = useState<Step>("upload");

  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [maskBase64, setMaskBase64] = useState("");
  const [overlayBase64, setOverlayBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(0.5);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);

  const handleImageLoad = (base64: string, preview: string) => {
    setImageBase64(base64);
    setPreviewUrl(preview);
    setMaskBase64("");
    setOverlayBase64("");
    setError("");
    setInferenceMs(null);
    setStep("prompt");
  };

  const handleTextSubmit = async () => {
    if (!imageBase64 || !prompt.trim()) return;

    setLoading(true);
    setError("");
    setMaskBase64("");
    setOverlayBase64("");
    setPromptMode("text");

    try {
      const res = await segmentImage({
        image_base64: imageBase64,
        prompt,
        threshold,
      });

      setMaskBase64(res.mask_base64);
      setOverlayBase64(res.overlay_base64);
      setInferenceMs(res.inference_ms);
      setStep("result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMaskReady = async (mask: string) => {
    if (!imageBase64 || !mask) return;

    setLoading(true);
    setError("");
    setMaskBase64("");
    setOverlayBase64("");
    setPromptMode("image");

    try {
      const res = await segmentByImage({
        image_base64: imageBase64,
        mask_base64: mask,
        threshold,
      });

      setMaskBase64(res.mask_base64);
      setOverlayBase64(res.overlay_base64);
      setInferenceMs(res.inference_ms);
      setStep("result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setImageBase64("");
    setPreviewUrl("");
    setPrompt("");
    setMaskBase64("");
    setOverlayBase64("");
    setError("");
    setInferenceMs(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">CLIPSeg Demo</h1>

      {/* MODE SWITCH (only after upload) */}
      {step !== "upload" && (
        <div className="flex gap-2">
          <button
            onClick={() => setMode("text")}
            className={`px-4 py-2 border ${
              mode === "text" ? "bg-black text-white" : ""
            }`}
          >
            Text Prompt
          </button>
          <button
            onClick={() => setMode("image")}
            className={`px-4 py-2 border ${
              mode === "image" ? "bg-black text-white" : ""
            }`}
          >
            Image Prompt
          </button>
        </div>
      )}

      {/* STEP: UPLOAD */}
      {step === "upload" && (
        <ImageUpload onImageLoad={handleImageLoad} />
      )}

      {/* STEP: PROMPT */}
      {step === "prompt" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">Image loaded ✅</p>

          {mode === "text" && (
            <TextPrompt
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleTextSubmit}
              loading={loading}
              threshold={threshold}
              onThresholdChange={setThreshold}
            />
          )}

          {mode === "image" && previewUrl && (
            <CanvasDrawer
              imageUrl={previewUrl}
              onMaskReady={handleMaskReady}
            />
          )}
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {/* STEP: RESULT */}
      {step === "result" && maskBase64 && previewUrl && overlayBase64 && (
        <>
          <SegmentationResult
            originalUrl={previewUrl}
            maskBase64={maskBase64}
            overlayBase64={overlayBase64}
            inferenceMs={inferenceMs ?? 0}
            promptMode={promptMode}
          />

          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 border self-start"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
}
