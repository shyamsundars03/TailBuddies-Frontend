import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "../lib/redux/ReduxProvider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TailBuddies",
  description: "Pet Consulation",
  generator: "TailBuddies",
  icons: {
    icon: [
      {
        url: "/tailbuddies-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/tailbuddies-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/tailbuddies-logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/tailbuddies-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
