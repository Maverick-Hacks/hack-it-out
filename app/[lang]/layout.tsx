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
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'ta' }]
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
