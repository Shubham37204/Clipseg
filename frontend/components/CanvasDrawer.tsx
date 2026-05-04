"use client";

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  imageUrl: string;
}

export interface CanvasDrawerRef {
  extractMask: () => string;
  clearCanvas: () => void;
  hasDrawing: () => boolean;
}

const CanvasDrawer = forwardRef<CanvasDrawerRef, Props>(({ imageUrl }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const brushSize = 40;

  useImperativeHandle(ref, () => ({
    extractMask: () => {
      const canvas = canvasRef.current;
      if (!canvas) return "";

      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;

      const ctx = offscreen.getContext("2d");
      if (!ctx) return "";

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);
      ctx.drawImage(canvas, 0, 0);

      const dataUrl = offscreen.toDataURL("image/png");
      return dataUrl.replace(/^data:image\/png;base64,/, "");
    },
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    hasDrawing: () => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext("2d");
      const pixels = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      return pixels ? Array.from(pixels).some((p) => p > 0) : false;
    }
  }));

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

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [imageUrl]);

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
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

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
        <span className="text-primary font-bold">💡 Tip:</span> Fill the object area completely for best results, don't just outline it.
      </p>
      <div className="relative group rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-black">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Base for drawing"
          className="block w-full h-auto select-none opacity-80"
          draggable={false}
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 cursor-crosshair opacity-60 mix-blend-screen"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext("2d");
                if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
              }} 
              className="rounded-full shadow-lg"
            >
                <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
        </div>
      </div>
    </div>
  );
});

CanvasDrawer.displayName = "CanvasDrawer";

export default CanvasDrawer;
