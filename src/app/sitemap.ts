import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_CONFIG.url}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_CONFIG.url}/feedback`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_CONFIG.url}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_CONFIG.url}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
