import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://najdideal.cz'
  const now = new Date()

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${base}/vip`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${base}/login`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/register`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/faq`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/kontakt`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${base}/b2b`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${base}/gdpr`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${base}/obchodni-podminky`, priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return staticPages.map(p => ({ ...p, lastModified: now }))
}
