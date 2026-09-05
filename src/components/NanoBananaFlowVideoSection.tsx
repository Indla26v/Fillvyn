'use client';

import React from 'react';
import Image from 'next/image';
import NanoBananaFlowVideoShowcase from './NanoBananaFlowVideoShowcase';
import { Film, Sparkles, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function NanoBananaFlowVideoSection() {
  return (
    <section id="nanobanana-flow-video" className="py-12 md:py-16 bg-slate-950 text-white relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NanoBananaFlowVideoShowcase autoPlay={true} />
      </div>
    </section>
  );
}
