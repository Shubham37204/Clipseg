"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Sparkles, Scissors } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Powered by CLIPSeg</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                The Future of <br/><span className="text-primary">Semantic Segmentation</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                CLIPSeg is a state-of-the-art neural network designed for unified image segmentation. 
                By leveraging the power of CLIP (Contrastive Language-Image Pre-training), our system 
                can segment objects based on any arbitrary text prompt or image snippet.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Zero-Shot", desc: "No training needed for new objects." },
                  { title: "Semantic", desc: "Understands conceptual language." },
                  { title: "Universal", desc: "Works across all domains and styles." },
                  { title: "Fast", desc: "Real-time processing for production." }
                ].map((item, i) => (
                  <Card key={i} className="p-4 border-border/50 bg-card/30 backdrop-blur">
                    <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl" />
              <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur w-full max-w-md mx-auto aspect-square flex items-center justify-center p-8">
                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <Scissors className="h-24 w-24 text-primary animate-pulse" />
                 </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
