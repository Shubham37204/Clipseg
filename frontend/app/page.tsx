"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scissors, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-24 pb-24"
        >
          {/* Hero Section */}
          <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center">
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

            <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
              <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary mb-4">
                Next-Gen Image Segmentation
              </Badge>

              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                Precision Segments. <br />
                <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  Zero Effort.
                </span>
              </h1>

              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Powered by CLIPSeg, isolate any object in an image using natural language or simple visual cues.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/workspace">
                  <Button size="lg" className="h-14 rounded-full px-10 text-lg font-bold shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 rounded-full px-10 text-lg font-semibold transition-all hover:bg-muted/50">
                  View Demo
                </Button>
              </div>

              <div className="mt-16 w-full max-w-5xl rounded-2xl border border-border/50 bg-card/30 p-2 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(255,165,0,0.3)]">
                 <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted/20 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070&auto=format&fit=crop" 
                      alt="Feature Preview" 
                      className="w-full h-full object-cover opacity-60 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-mono">Prompt: "the golden retriever"</span>
                            </div>
                            <div className="h-px w-24 bg-white/20" />
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <ShieldCheck className="h-5 w-5" />
                                <span>Segment Isolated</span>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-16">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple. Powerful. Fast.</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Three steps to professional-grade image segmentation.</p>
                </div>

                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 w-full">
                  {[
                    { step: "01", title: "Upload Image", desc: "Drag and drop your high-resolution image. We support PNG, JPG, and WebP." },
                    { step: "02", title: "Define Prompt", desc: "Type a natural language description or draw a rough sketch of the object." },
                    { step: "03", title: "Get Results", desc: "Our AI isolates the object instantly. Download the mask or overlay." }
                  ].map((item, i) => (
                    <div key={i} className="relative group p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/20">
                      <div className="text-8xl font-black text-primary/5 absolute -top-8 -left-4 group-hover:text-primary/10 transition-colors pointer-events-none">{item.step}</div>
                      <div className="relative space-y-4">
                        <h4 className="text-2xl font-bold">{item.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-muted/30 py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid gap-16 lg:grid-cols-2 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Powered by CLIPSeg</span>
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight">The Future of <br/><span className="text-primary">Semantic Segmentation</span></h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Unlike traditional tools that require manual tracing, CLIPSeg understands the content of your images. 
                    By leveraging the power of CLIP, our system maps text descriptions directly to visual pixels with unprecedented accuracy.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Zero-shot object detection",
                      "Natural language understanding",
                      "Visual prompt support",
                      "Production-ready inference"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 bg-card/50 p-3 rounded-xl border border-border/50">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-medium text-sm">{text}</span>
                      </li>
                    ))}
                  </ul>
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
          </section>

          {/* Use Cases Section */}
          <section className="py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for Every Workflow</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From creative design to automated data labeling.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "E-commerce", desc: "Automatically remove backgrounds from product photos for clean listings." },
                  { title: "Creative Arts", desc: "Isolate elements for digital collages, matte painting, and VFX." },
                  { title: "AI Training", desc: "Generate high-quality masks for training computer vision models." },
                  { title: "Social Media", desc: "Create stunning stickers and overlays for your content instantly." }
                ].map((useCase, i) => (
                  <Card key={i} className="p-8 border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-default bg-card/30 backdrop-blur-sm">
                    <h4 className="text-xl font-bold mb-3">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{useCase.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
