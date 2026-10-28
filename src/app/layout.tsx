import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SITE_CONFIG } from '@/config/site';
import './globals.css';

const title = 'Fillvyn: AI Autofill for Google Forms & Microsoft Forms';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: title,
    template: '%s | Fillvyn',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Fillvyn',
    'Google Forms Autofill',
    'Microsoft Forms Autofill',
    'Job Application Autofill',
    'Resume Autofill Chrome Extension',
    'Ollama Local LLM',
    'RAG Chrome Extension',
    'Form Filler',
  ],
  authors: [{ name: 'Fillvyn Engineering' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_CONFIG.name,
    title,
    description: SITE_CONFIG.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: SITE_CONFIG.description,
  },
  verification: {
    google: '3mBAlZ_tYvnrHdrO6zU4r0UOGRAP7w4jPIj1KJh0N7I',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
