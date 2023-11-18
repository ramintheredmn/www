import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/themeprovider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR gadget',
  description: 'Your HeartRate matters!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        
        {children}
        </ThemeProvider>
        </body>
    </html>
  )
}
