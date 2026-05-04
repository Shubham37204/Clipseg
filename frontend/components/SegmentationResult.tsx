"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Expand, Layers, Image as ImageIcon, Eye, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  originalUrl: string;
  maskBase64: string;
  overlayBase64: string;
  userScribble?: string;
  inferenceMs: number;
  promptMode: "text" | "image";
}

export default function SegmentationResult({
  originalUrl,
  maskBase64,
  overlayBase64,
  userScribble,
  inferenceMs,
  promptMode,
}: Props) {
  const maskUrl = `data:image/png;base64,${maskBase64}`;
  const overlayUrl = `data:image/png;base64,${overlayBase64}`;
  const scribbleUrl = userScribble ? `data:image/png;base64,${userScribble}` : null;
  const [view, setView] = useState("overlay");

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `clipseg-${name}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {promptMode === "text" ? "Text AI" : "Visual AI"}
          </Badge>
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
            {inferenceMs.toFixed(0)}ms
          </Badge>
        </div>
        
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" onClick={() => downloadImage(overlayUrl, 'result')}>
              <Download className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row flex-1 overflow-hidden">
        {/* Main Preview */}
        <div className="flex-1 relative group bg-black/20 rounded-xl border overflow-hidden flex items-center justify-center min-h-[300px]">
           <img
            src={view === "overlay" ? overlayUrl : view === "mask" ? maskUrl : view === "scribble" && scribbleUrl ? scribbleUrl : originalUrl}
            alt="Result"
            className="max-w-full max-h-full object-contain transition-all duration-500"
          />
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-background/80 backdrop-blur border shadow-xl">
             <Button 
                variant={view === "original" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs"
                onClick={() => setView("original")}
              >
                Original
             </Button>
             {scribbleUrl && (
               <Button 
                 variant={view === "scribble" ? "default" : "ghost"} 
                 size="sm" 
                 className="rounded-full h-8 px-4 text-xs"
                 onClick={() => setView("scribble")}
               >
                 Scribble
               </Button>
             )}
             <Button 
                variant={view === "mask" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs"
                onClick={() => setView("mask")}
              >
                Mask
             </Button>
             <Button 
                variant={view === "overlay" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-full h-8 px-4 text-xs"
                onClick={() => setView("overlay")}
              >
                Overlay
             </Button>
          </div>
        </div>

        {/* Thumbnails / Comparison Side */}
        <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-48 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {[
            { id: "original", label: "Original", url: originalUrl, icon: <ImageIcon className="h-3 w-3" />, show: true },
            { id: "scribble", label: "Scribble", url: scribbleUrl || "", icon: <Paintbrush className="h-3 w-3" />, show: !!scribbleUrl },
            { id: "mask", label: "Mask", url: maskUrl, icon: <Layers className="h-3 w-3" />, show: true },
            { id: "overlay", label: "Result", url: overlayUrl, icon: <Eye className="h-3 w-3" />, show: true },
          ].filter(item => item.show).map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative flex-shrink-0 w-32 lg:w-full aspect-square rounded-lg border-2 transition-all overflow-hidden group ${
                view === item.id ? "border-primary scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 flex items-center justify-center gap-1.5">
                {item.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
