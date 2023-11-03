import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthify',
  description: 'Your personalized AI doctor',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Healthify: Your Virtual Doctor',
    description: 'Your Virtual Doctor',
    url: 'https://hack-it-out.vercel.app/',
    siteName: 'Healthify',
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: 'https://hack-it-out.vercel.app/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Healthify',
      },
    ],
  },
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }]
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className + ' flex min-h-screen flex-col'}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
