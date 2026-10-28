import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InteractiveDemo from '@/components/InteractiveDemo';
import FeaturesGrid from '@/components/FeaturesGrid';
import ProductShowcase from '@/components/ProductShowcase';
import SetupGuide from '@/components/SetupGuide';
import ComparisonSection from '@/components/ComparisonSection';
import FaqSection from '@/components/FaqSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import Footer from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { FAQS } from '@/data/mockData';

// Search engine structured data: the extension listing and the FAQ.
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.name,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome, Edge, Brave, Arc',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    installUrl: SITE_CONFIG.chromeExtensionUrl,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <HeroSection />
      <InteractiveDemo />
      <FeaturesGrid />
      <ProductShowcase />
      <ComparisonSection />
      <SetupGuide />
      <FaqSection />
      <QuickLinksSection />
      <Footer />
    </main>
  );
}
