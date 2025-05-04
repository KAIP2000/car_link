import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import ConvexClientProvider from "@/components/convex-client-provider"
import { MainLayout } from "@/components/main-layout"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

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
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} bg-white dark:bg-gray-950`} suppressHydrationWarning>
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
