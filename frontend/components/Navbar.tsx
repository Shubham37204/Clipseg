"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Scissors } from "lucide-react";

interface NavbarProps {
  minimal?: boolean;
}

export function Navbar({ minimal }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Scissors className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            CLIP<span className="text-primary">Seg</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!minimal && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/features"
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === "/features" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Features
              </Link>
              <Link
                href="/about"
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === "/about" ? "text-primary" : "text-muted-foreground"
                )}
              >
                About
              </Link>
            </div>
          )}
          
          <ModeToggle />
          
          {!minimal && (
            <Link href="/workspace">
              <Button 
                variant="default" 
                className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu could be added here */}
      </div>
    </nav>
  );
}
