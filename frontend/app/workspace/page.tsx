"use client";
import { useState, useRef } from "react";
import ImageUpload from "@/components/ImageUpload";
import TextPrompt from "@/components/TextPrompt";
import CanvasDrawer from "@/components/CanvasDrawer";
import { segmentImage, segmentByImage } from "@/services/api";
import SegmentationResult from "@/components/SegmentationResult";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

type Mode = "text" | "image";
type Step = "upload" | "choose" | "prompt" | "result";

export default function WorkspacePage() {
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
  const [threshold, setThreshold] = useState(0.3);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [userScribble, setUserScribble] = useState("");

  const handleImageLoad = (base64: string, preview: string) => {
    setImageBase64(base64);
    setPreviewUrl(preview);
    setMaskBase64("");
    setOverlayBase64("");
    setError("");
    setInferenceMs(null);
    setStep("choose");
    toast.success("Image loaded successfully");
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
    setUserScribble(mask);
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
    setUserScribble("");
  };

  const canvasRef = useRef<any>(null);

  const handleImageSubmit = () => {
    if (canvasRef.current?.hasDrawing()) {
      const mask = canvasRef.current.extractMask();
      handleMaskReady(mask);
    } else {
      toast.error("Please draw on the image first");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal={true} />
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">CLIPSeg Workspace</h1>
            <p className="text-muted-foreground mt-2">Zero-shot image segmentation powered by CLIP</p>
          </div>

          {(step === "upload" || step === "choose") ? (
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur shadow-xl">
                {step === "upload" && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                       <h3 className="text-2xl font-bold">Step 1: Upload Image</h3>
                       <p className="text-muted-foreground">Select the image you want to process</p>
                    </div>
                    <ImageUpload onImageLoad={handleImageLoad} />
                  </div>
                )}

                {step === "choose" && (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                       <h3 className="text-2xl font-bold">Step 2: Choose Prompt Type</h3>
                       <p className="text-muted-foreground">How would you like to isolate your object?</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Button 
                        variant="outline" 
                        className="h-40 flex flex-col gap-4 border-primary/20 hover:border-primary hover:bg-primary/5 group p-6"
                        onClick={() => {
                          setMode("text");
                          setStep("prompt");
                        }}
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="text-2xl">📝</span>
                        </div>
                        <div className="text-center">
                           <span className="block text-lg font-bold group-hover:text-primary transition-colors">Text Prompt</span>
                           <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Natural Language</span>
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-40 flex flex-col gap-4 border-primary/20 hover:border-primary hover:bg-primary/5 group p-6"
                        onClick={() => {
                          setMode("image");
                          setStep("prompt");
                        }}
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <span className="text-2xl">🎨</span>
                        </div>
                        <div className="text-center">
                           <span className="block text-lg font-bold group-hover:text-primary transition-colors">Image Prompt</span>
                           <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Visual Sketch</span>
                        </div>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="w-full text-muted-foreground hover:text-foreground">
                      ← Back to Upload
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">
              {/* Image Preview (Now on Top) */}
              <div className="w-full">
                <Card className="relative overflow-hidden border-border bg-muted/30 backdrop-blur flex items-center justify-center p-4 min-h-[400px]">
                  {(step === "prompt" && mode === "text") && previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-[70vh] rounded-md shadow-2xl object-contain animate-in fade-in duration-500" 
                    />
                  )}

                  {step === "prompt" && mode === "image" && previewUrl && (
                    <CanvasDrawer
                      ref={canvasRef}
                      imageUrl={previewUrl}
                    />
                  )}

                  {step === "result" && maskBase64 && previewUrl && overlayBase64 && (
                    <SegmentationResult
                      originalUrl={previewUrl}
                      maskBase64={maskBase64}
                      overlayBase64={overlayBase64}
                      userScribble={userScribble}
                      inferenceMs={inferenceMs ?? 0}
                      promptMode={promptMode}
                    />
                  )}
                  
                  {loading && (
                     <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-xl font-bold text-primary">AI Isolating Object...</p>
                        </div>
                     </div>
                  )}
                </Card>
              </div>

              {/* Controls (Now on Bottom) */}
              <div className="w-full">
                <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur shadow-xl">
                  {step === "prompt" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-bold">Step 3: Define Selection</h3>
                         <Button variant="ghost" size="sm" onClick={() => setStep("choose")} className="text-xs">Change Mode</Button>
                      </div>
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
                      {mode === "image" && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground p-6 text-center border-2 border-dashed rounded-lg bg-muted/20">
                          Use the drawing tools above to mark the object you want to isolate.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                               <span className="text-sm font-medium">Confidence Threshold</span>
                               <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                 {threshold.toFixed(2)}
                               </span>
                             </div>
                             <Slider
                               min={0}
                               max={1}
                               step={0.01}
                               value={[threshold]}
                               onValueChange={(val) => {
                                 if (Array.isArray(val) && val.length > 0) {
                                   setThreshold(val[0]);
                                 } else if (typeof val === "number") {
                                   setThreshold(val);
                                 }
                               }}
                               className="py-4"
                             />
                          </div>

                          <Button 
                            size="lg" 
                            onClick={handleImageSubmit} 
                            disabled={loading}
                            className="w-full h-12 rounded-full gap-2 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                          >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                            Analyze Selection
                          </Button>
                        </div>
                      </div>
                    )}
                    </div>
                  )}

                  {error && <p className="text-destructive font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20 mt-4">{error}</p>}

                  {step === "result" && (
                    <div className="mt-6 flex flex-col gap-4">
                      <h3 className="text-xl font-bold mb-2">Analysis Complete</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button variant="default" onClick={handleReset} className="w-full h-12 rounded-full font-bold shadow-lg shadow-primary/20">
                          Start New Analysis
                        </Button>
                        <Button variant="outline" onClick={() => setStep("prompt")} className="w-full h-12 rounded-full font-semibold">
                          Refine Selection
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
