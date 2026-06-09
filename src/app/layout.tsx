import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/Providers"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CartSheet } from "@/components/cart/CartSheet"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: {
    default: "Furmey — Luxury Pet Fashion",
    template: "%s | Furmey",
  },
  description:
    "Premium luxury pet fashion and accessories. Dress your beloved companions in style with Furmey's exclusive collections.",
  keywords: ["pet fashion", "luxury pet accessories", "designer pet clothes", "premium dog collars"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://furmey.com",
    siteName: "Furmey",
    title: "Furmey — Luxury Pet Fashion",
    description: "Premium luxury pet fashion and accessories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furmey — Luxury Pet Fashion",
    description: "Premium luxury pet fashion and accessories.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSheet />
        </Providers>
      </body>
    </html>
  )
}
