"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  imageUrl: string;
  onMaskReady: (maskBase64: string) => void;
}

export default function CanvasDrawer({ imageUrl, onMaskReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);

  // Sync canvas size with image
  useEffect(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const updateSize = () => {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
    };

    if (img.complete) updateSize();
    else img.onload = updateSize;
  }, [imageUrl]);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    draw(e);
  };

  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseLeave = () => setIsDrawing(false);

  const extractMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    const ctx = offscreen.getContext("2d");
    if (!ctx) return "";

    // black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    // draw strokes
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = offscreen.toDataURL("image/png");
    return dataUrl.replace(/^data:image\/png;base64,/, "");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // check if canvas is all black (nothing drawn)
    const ctx = canvas.getContext("2d");
    const pixels = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
    const hasDrawing = pixels ? Array.from(pixels).some((p) => p > 0) : false;

    if (!hasDrawing) {
      alert("Please draw on the image first");
      return;
    }

    const mask = extractMask();
    onMaskReady(mask);
  };

  return (
    <div>
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt="base"
          style={{ display: "block", maxWidth: "100%" }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "crosshair",
            opacity: 0.5,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="range"
          min={5}
          max={100}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />

        <button onClick={clearCanvas}>Clear</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
