import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { FilterProvider } from '@/contexts/FilterContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinanceFlow',
  description: 'Created with FinanceFlow',
  generator: 'FinanceFlow.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <FilterProvider>
          {children}
        </FilterProvider>
      </body>
    </html>
  )
}
