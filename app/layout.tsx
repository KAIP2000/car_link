import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import ConvexClientProvider from "@/components/convex-client-provider"
import { MainLayout } from "@/components/main-layout"
import { Toaster } from "@/components/ui/sonner"
import { DM_Serif_Display, Inter } from "next/font/google"

// Body font: Inter (sans-serif)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter" 
})

// Heading font: DM Serif Display (serif, similar to Turo)
const dmSerifDisplay = DM_Serif_Display({ 
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif" 
})

export const metadata: Metadata = {
  title: "Car Link",
  description: "Rent just about any car, just about anywhere",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerifDisplay.variable}`}>
          <body className="bg-white dark:bg-gray-950 font-sans" suppressHydrationWarning>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
