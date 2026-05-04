"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Zap, ImageIcon, Scissors } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Core Features</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the powerful tools that make CLIPSeg the leading choice for AI-driven image segmentation.
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col gap-4 p-8 border-border/50 bg-card/50 backdrop-blur">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Instant Inference</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our optimized CLIPSeg models are engineered for speed, delivering precise segmentation masks in milliseconds, even for complex images.
              </p>
            </Card>
            <Card className="flex flex-col gap-4 p-8 border-border/50 bg-card/50 backdrop-blur">
              <div className="h-12 w-12 rounded-lg bg-orange-400/10 flex items-center justify-center text-orange-400">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Visual Context</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sometimes words aren't enough. Our interactive canvas allows you to provide direct visual cues to guide the AI with pixel-perfect accuracy.
              </p>
            </Card>
            <Card className="flex flex-col gap-4 p-8 border-border/50 bg-card/50 backdrop-blur">
              <div className="h-12 w-12 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                <Scissors className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Seamless Export</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export your results as high-resolution alpha-channel masks or transparent PNG overlays, ready for immediate use in any design software.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
