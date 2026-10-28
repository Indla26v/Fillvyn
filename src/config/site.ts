export const SITE_CONFIG = {
  name: 'Fillvyn',
  tagline: 'AI Forms Auto-Filler',
  description:
    'Free Chrome extension that fills Google Forms and Microsoft Forms from your resume and GitHub projects, privately with local Ollama or with the cloud AI you choose.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://fillvyn.vercel.app').replace(/\/$/, ''),
  chromeExtensionUrl:
    process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL ||
    'https://chromewebstore.google.com/detail/fillvyn-ai-forms-auto-fil/jcemhdibdeekkkjeoenokjlhcfjkhinf',
  supportEmail: 'fillvyn.support@gmail.com',
  links: {
    ollamaDocs: 'https://ollama.com',
    privacyPolicy: '/privacy',
    feedback: '/feedback',
    contact: '/contact',
  },
} as const;
