'use client';

import React, { useState } from 'react';
import { LOCAL_SPECS } from '../data/mockData';
import {
  Cpu,
  HardDrive,
  Zap,
  Sparkles,
  Layers,
} from 'lucide-react';

/** Local vs cloud hardware requirements; rendered inside the Setup Guide's collapsible panel. */
export default function SpecsGuide() {
  const [activeMode, setActiveMode] = useState<'local' | 'cloud'>('local');

  return (
    <div>
        {/* Mode Selector (Pill tabs) */}
        <div className="flex items-center justify-center mb-10 px-2">
          <div className="inline-flex flex-col sm:flex-row p-1.5 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-full border border-slate-200 shadow-sm gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              aria-pressed={activeMode === 'local'}
              onClick={() => setActiveMode('local')}
              className={`px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'local'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Local Ollama (Offline)</span>
            </button>

            <button
              type="button"
              aria-pressed={activeMode === 'cloud'}
              onClick={() => setActiveMode('cloud')}
              className={`px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'cloud'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Cloud AI (Gemini / OpenAI)</span>
            </button>
          </div>
        </div>

        {/* Local Ollama Specs Cards */}
        {activeMode === 'local' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOCAL_SPECS.map((spec, idx) => (
              <div
                key={idx}
                className={`bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                  idx === 1
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                      {spec.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Tier {idx + 1}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{spec.tier}</h3>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                    <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Target Models</div>
                    <div className="text-xs font-mono font-bold text-indigo-700">{spec.models}</div>
                  </div>

                  {/* Spec list */}
                  <div className="space-y-3 text-xs pt-2">
                    <div className="flex items-start gap-2.5">
                      <Cpu className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-700">Processor (CPU)</div>
                        <div className="text-slate-500">{spec.cpu}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-700">Memory (RAM)</div>
                        <div className="text-slate-500 font-bold text-indigo-600">{spec.ram}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-700">Graphics (GPU)</div>
                        <div className="text-slate-500">{spec.gpu}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <HardDrive className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-700">Storage</div>
                        <div className="text-slate-500">{spec.storage}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium">100% Free & Zero Cloud Bills</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Cloud Mode Spec Card */
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  Lightweight & Instant
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Standard Cloud AI Specification</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Zero Local GPU Needed</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              If your laptop has 4 GB or 8 GB RAM and no dedicated GPU, you can connect your free Google Gemini API key or OpenAI key. The extension uses negligible background CPU and provides sub-second generation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-500 font-semibold mb-1">Supported Cloud Providers</div>
                <div className="font-bold text-slate-800">Google Gemini 1.5 Flash, OpenAI GPT-4o-mini, Anthropic Claude</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-500 font-semibold mb-1">Minimum RAM Required</div>
                <div className="font-bold text-indigo-600">4 GB RAM (Any basic laptop or desktop)</div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
