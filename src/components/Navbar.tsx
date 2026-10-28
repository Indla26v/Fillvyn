'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

const NAV_LINKS = [
  { href: '/#interactive-demo', label: 'Live Demo' },
  { href: '/#features', label: 'Features' },
  { href: '/#quickstart', label: 'Setup Guide' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Stretched container reaching closer to ends */}
      <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform border border-slate-200/80 bg-white p-1 flex items-center justify-center">
              <Image
                src="/images/fillvyn-logo.png"
                alt="Fillvyn"
                fill
                priority
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fillvyn
              </span>
              <p className="text-[11px] text-slate-600 font-medium leading-none">Google & Microsoft Forms</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button (Pill-shaped, Clean UI) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={SITE_CONFIG.chromeExtensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-500/20 rounded-full transition-all"
            >
              <span>Add to Chrome</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <span className={`block h-0.5 bg-slate-800 rounded-full transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 bg-slate-800 rounded-full transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-slate-800 rounded-full transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="md:hidden mt-3 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-3"
          >
            {[...NAV_LINKS, { href: '/privacy', label: 'Privacy Policy' }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={SITE_CONFIG.chromeExtensionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm"
              >
                Add to Chrome, It&apos;s Free
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
