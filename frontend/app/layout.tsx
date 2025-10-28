import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { FilterProvider } from '@/contexts/FilterContext'
<<<<<<< HEAD
import { AuthProvider } from '@/contexts/AuthContext'
=======
import { ClientProvider } from '@/contexts/ClientContext'
>>>>>>> a77f7d4b8c83b43a09e733c2982d6b7eda104ca6
import { Toaster } from '@/components/ui/toaster'
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
<<<<<<< HEAD
        <AuthProvider>
          <FilterProvider>
            {children}
          </FilterProvider>
        </AuthProvider>
=======
        <ClientProvider>
          <FilterProvider>
            {children}
          </FilterProvider>
        </ClientProvider>
>>>>>>> a77f7d4b8c83b43a09e733c2982d6b7eda104ca6
        <Toaster />
      </body>
    </html>
  )
}
