import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Feedback',
  description: 'Rate Fillvyn and tell us what to build next for Google Forms and Microsoft Forms autofill.',
  alternates: { canonical: '/feedback' },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
