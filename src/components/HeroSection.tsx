import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, FileText, Github, Play, LayoutList } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

import HeroDemoAnimation from './HeroDemoAnimation';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background AI Mesh & Luminous Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
      </div>

      {/* Decorative Radial Ambient Lights */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Fill Job Application Forms in Seconds,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Straight from Your Resume
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Fillvyn is a free Chrome extension that fills <strong className="text-slate-900 font-semibold">Google Forms</strong> and <strong className="text-slate-900 font-semibold">Microsoft Forms</strong> for you. It answers every question, from notice period and expected salary to &ldquo;describe a project you&apos;re proud of&rdquo;, using your <strong className="text-slate-900 font-semibold">resume</strong> and <strong className="text-slate-900 font-semibold">GitHub projects</strong>.
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
              <span>Add to Chrome, It&apos;s Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#interactive-demo"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 border border-slate-300 shadow-sm rounded-full transition-all"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Try the Live Demo</span>
            </a>
          </div>

          {/* Trust Highlights Badges */}
          <ul className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-slate-600">
            <li className="flex items-center gap-2">
              <LayoutList className="w-4 h-4 text-indigo-600" />
              <span>Google Forms & Microsoft Forms</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Answers from your resume</span>
            </li>
            <li className="flex items-center gap-2">
              <Github className="w-4 h-4 text-slate-700" />
              <span>Knows your GitHub projects</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Private by default with local AI</span>
            </li>
          </ul>

          {/* Plain statement of where data goes in each mode */}
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            With local Ollama, your resume and answers never leave your computer. If you choose a cloud model
            (Gemini, OpenAI or Claude), the form questions and relevant resume details go to that provider.
          </p>
        </div>

        {/* Animated walkthrough of a form being filled */}
        <div className="mt-12 max-w-5xl mx-auto">
          <HeroDemoAnimation />
        </div>
      </div>
    </section>
  );
}
