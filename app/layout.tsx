import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudentApply',
  description: 'University program application platform powered by PostgreSQL and MongoDB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-ibm-canvas antialiased">

        {/* ── Top navigation — IBM Carbon dark shell ── */}
        <header className="bg-ibm-nav sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-ibm-text-inverse text-base font-bold tracking-wide hover:text-ibm-blue transition-colors"
            >
              StudentApply
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/programs"
                className="text-base font-semibold tracking-wide text-gray-300 hover:text-white hover:bg-ibm-nav-hover px-5 py-2.5 transition-colors"
              >
                Programs
              </Link>
              <Link
                href="/dashboard"
                className="text-base font-semibold tracking-wide text-gray-300 hover:text-white hover:bg-ibm-nav-hover px-5 py-2.5 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {children}

      </body>
    </html>
  )
}
