import LuxuryCursor from '@/components/ui/LuxuryCursor'
import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { CursorProvider } from '@/components/effects/CursorProvider'
import { NoiseOverlay } from '@/components/effects/NoiseOverlay'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: { default: 'NajdiDeal – Najdi deal dřív než ostatní', template: '%s | NajdiDeal' },
  description: 'NajdiDeal – AI platforma pro flipování a online příležitosti. Nakup levněji, prodej dráž. Každý den nové dealy z Bazoše, Vinted a dalších trhů.',
  keywords: ['flipování', 'dealy', 'marketplace flip', 'jak vydělat online', 'bazos flip', 'vinted flip', 'online příležitosti', 'AI dealy', 'profit', 'NajdiDeal', 'nakup levně prodej draze'],
  authors: [{ name: 'NajdiDeal' }],
  creator: 'NajdiDeal',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://najdideal.cz'),
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://najdideal.cz',
    title: 'NajdiDeal – Najdi deal dřív než ostatní',
    description: 'Nejprémiernější deal komunita v ČR a SK. Flipuj, vydělávej, buď první.',
    siteName: 'NajdiDeal',
  },
  twitter: { card: 'summary_large_image', title: 'NajdiDeal', description: 'Najdi deal dřív než ostatní.' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="dark">
      <body className="bg-void-1000 text-white antialiased">
        <NoiseOverlay />
        <Navbar />
        <CursorProvider />
        {children}
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1C1C22',
              color: '#F0EDE6',
              border: '1px solid rgba(245,184,0,0.15)',
              borderRadius: '10px',
              fontFamily: 'Barlow, sans-serif',
              fontSize: '14px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#00E676', secondary: '#1C1C22' } },
            error:   { iconTheme: { primary: '#FF4444', secondary: '#1C1C22' } },
          }}
        />
      <LuxuryCursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NajdiDeal",
            "url": "https://najdideal.cz",
            "logo": "https://najdideal.cz/og-image.png",
            "description": "AI platforma pro flipování a online příležitosti v ČR",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "info@najdideal.cz",
              "contactType": "customer service",
              "availableLanguage": "Czech"
            }
          })}}
        />
      </body>
    </html>
  )
}
