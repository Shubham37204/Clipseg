"use client";

import Image from "next/image";

interface Props {
  originalUrl: string;
  maskBase64: string;
  overlayBase64: string;
  inferenceMs: number;
}

export default function SegmentationResult({
  originalUrl,
  maskBase64,
  overlayBase64,
  inferenceMs,
}: Props) {
  const maskUrl = `data:image/png;base64,${maskBase64}`;
  const overlayUrl = `data:image/png;base64,${overlayBase64}`;

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* ⚡ Inference Badge */}
      <div className="self-start bg-gray-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
        ⚡ Inference: {inferenceMs.toFixed(2)} ms
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Original Image</p>
          <Image
            src={originalUrl}
            alt="Original"
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Segmentation Mask</p>
          <Image
            src={maskUrl}
            alt="Mask"
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <p className="mb-2 font-semibold">Overlay Result</p>
          <Image
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
