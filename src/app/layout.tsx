import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    'government schemes',
    'eligibility checker',
    'Indian government',
    'PM-KISAN',
    'Ayushman Bharat',
    'scholarship',
    'agriculture schemes',
    'multilingual',
    'AI assistant'
  ],
  authors: [{ name: 'Aryan Choudhary' }],
  creator: 'Aryan Choudhary',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    creator: '@aryancta',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4338ca',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}