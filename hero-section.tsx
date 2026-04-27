"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { Scale, ArrowRight, Calculator, Bot, Shield } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Scale className="h-4 w-4" />
              Northeast India&apos;s Legal & Business Platform
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Bridging the Gap Between{" "}
              <span className="text-primary">Law</span> and{" "}
              <span className="text-secondary">People</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
              NyayaSetu provides comprehensive legal services, AI-powered assistance, 
              and financial tools to help you navigate complex legal and business matters 
              with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setAuthModalOpen(true)} className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/ai-assistant">Try AI Assistant</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">AI Legal Assistant</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">4+</div>
                <div className="text-sm text-muted-foreground">Financial Calculators</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Availability</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-secondary">NE India</div>
                <div className="text-sm text-muted-foreground">Regional Focus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="container mx-auto mt-20 px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">AI Legal Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get instant answers to your legal questions with our free AI-powered assistant.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-secondary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Financial Calculators</h3>
              <p className="text-sm text-muted-foreground">
                SIP, EMI, Tax, and Insurance premium calculators for informed decisions.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Legal Services</h3>
              <p className="text-sm text-muted-foreground">
                Professional legal consultation and services across Northeast India.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        mode="register"
        onModeChange={() => {}}
      />
    </>
  );
}
