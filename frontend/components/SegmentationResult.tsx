interface Props {
  originalUrl: string; // preview URL from FileReader
  maskBase64: string; // base64 PNG from backend
  overlayBase64: string; // ✅ NEW
}

export default function SegmentationResult({
  originalUrl,
  maskBase64,
  overlayBase64,
}: Props) {
  const maskUrl = `data:image/png;base64,${maskBase64}`;
  const overlayUrl = `data:image/png;base64,${overlayBase64}`; // ✅ NEW

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Original Image */}
      <div className="flex-1 flex flex-col items-center">
        <p className="mb-2 font-semibold">Original Image</p>
        <img
          src={originalUrl}
          alt="Original"
          className="rounded-lg border max-w-full"
        />
      </div>

      {/* Mask Image */}
      <div className="flex-1 flex flex-col items-center">
        <p className="mb-2 font-semibold">Segmentation Mask</p>
        <img
          src={maskUrl}
          alt="Mask"
          className="rounded-lg border max-w-full"
        />
      </div>

      {/* ✅ Overlay Image */}
      <div className="flex-1 flex flex-col items-center">
        <p className="mb-2 font-semibold">Overlay Result</p>
        <img
          src={overlayUrl}
          alt="Overlay"
          className="rounded-lg border max-w-full"
        />
      </div>
    </div>
  );
}
