import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: 'Get help setting up Fillvyn, report a bug or ask about Ollama integration.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
