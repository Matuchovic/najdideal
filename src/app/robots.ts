import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/settings/',
          '/profile/',
          '/api/',
          '/saved/',
          '/notifications/',
        ],
      },
    ],
    sitemap: 'https://najdideal.cz/sitemap.xml',
    host: 'https://najdideal.cz',
  }
}
