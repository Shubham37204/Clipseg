"use client";

interface Props {
  originalUrl: string;
  maskBase64: string;
  overlayBase64: string;
  inferenceMs: number;
  promptMode: "text" | "image";
}

export default function SegmentationResult({
  originalUrl,
  maskBase64,
  overlayBase64,
  inferenceMs,
  promptMode,
}: Props) {
  const maskUrl = `data:image/png;base64,${maskBase64}`;
  const overlayUrl = `data:image/png;base64,${overlayBase64}`;

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* 🏷️ Mode Badge */}
      <div className="self-start bg-blue-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
        {promptMode === "text"
          ? "🔤 Text Prompt Result"
          : "🖌️ Image Prompt Result"}
      </div>

      {/* ⚡ Inference Badge */}
      <div className="self-start bg-gray-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
        ⚡ Inference: {inferenceMs.toFixed(2)} ms
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Original Image</p>
          <img
            src={originalUrl}
            alt="Original"
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Segmentation Mask</p>
          <img
            src={maskUrl}
            alt="Mask"
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Overlay Result</p>
          <img
            src={overlayUrl}
            alt="Overlay"
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        </div>
      </div>
    </div>
  );
}
