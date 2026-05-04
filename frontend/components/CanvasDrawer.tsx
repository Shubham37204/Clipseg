"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Trash2, Check, Paintbrush } from "lucide-react";

interface Props {
  imageUrl: string;
  onMaskReady: (maskBase64: string) => void;
}

export default function CanvasDrawer({ imageUrl, onMaskReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);

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

    // Handle window resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
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

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
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
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
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
            <Button variant="secondary" size="sm" onClick={clearCanvas} className="rounded-full shadow-lg">
                <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-xl border bg-card/50 backdrop-blur">
        <div className="flex-1 min-w-[200px] space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-primary" /> Brush Size
            </Label>
            <span className="text-xs font-mono">{brushSize}px</span>
          </div>
          <Slider
            min={5}
            max={150}
            step={1}
            value={[brushSize]}
            onValueChange={(val) => setBrushSize(val[0])}
          />
        </div>

        <div className="flex gap-2">
            <Button 
                size="lg" 
                onClick={handleSubmit} 
                className="rounded-full px-10 gap-2 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
                <Check className="h-5 w-5" /> Analyze Selection
            </Button>
        </div>
      </div>
    </div>
  );
}
