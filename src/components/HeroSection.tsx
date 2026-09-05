'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  Github, 
  Zap, 
  Layers, 
  Terminal, 
  Play,
  Film
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

import NanoBananaFlowVideoShowcase from './NanoBananaFlowVideoShowcase';

export default function HeroSection() {
  const [filled, setFilled] = useState(false);
  const [activeModel, setActiveModel] = useState('llama3.2:3b (Local)');

  const handleSimulateFill = () => {
    setFilled(true);
    setTimeout(() => {
      // Auto-reset after a few seconds for loop effect
    }, 4000);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background AI Mesh & Luminous Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
        <Image
          src="/images/hero-bg.jpg"
          alt="AI Luminous Mesh Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
      </div>

      {/* Decorative Radial Ambient Lights */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Fill Forms in Seconds with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Local RAG & Precision AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            The private, intelligent browser assistant engineered for developers and job seekers. Auto-fill <strong className="text-slate-900 font-semibold">Google Forms</strong> and <strong className="text-slate-900 font-semibold">Microsoft Forms</strong> with tailored answers synthesized directly from your <strong className="text-slate-900 font-semibold">Resume</strong> and <strong className="text-slate-900 font-semibold">GitHub READMEs</strong> using on-device Ollama or Cloud LLMs.
          </p>

          {/* CTA Button Group (Pill-shaped, Modern Clean UI) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 max-w-md sm:max-w-none mx-auto">
            <a
              href={SITE_CONFIG.chromeExtensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25 rounded-full transition-all group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Install Fillvyn Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#interactive-demo"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 border border-slate-300 shadow-sm rounded-full transition-all"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Try Live Simulator</span>
            </a>
          </div>

          {/* Trust Highlights Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Offline & Private (Ollama)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Instant DOM Auto-Fill</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Smart LPA & Notice Formatter</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-slate-700" />
              <span>1-Click README Ingest</span>
            </div>
          </div>
        </div>

        {/* Dynamic Video Showcase in place of static mockup */}
        <div className="mt-12 max-w-5xl mx-auto">
          <NanoBananaFlowVideoShowcase autoPlay={true} />
        </div>
      </div>
    </section>
  );
}
