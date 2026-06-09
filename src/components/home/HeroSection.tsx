"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[var(--cream)]">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, var(--gold) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--gold) 0%, transparent 50%)" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">Luxury Pet Fashion</span>
            </motion.div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Style Meets <span className="italic text-[var(--gold)]">Paw-fection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Elevate your pet&apos;s wardrobe with our handcrafted luxury collection. Designed for the discerning pet parent who believes their companion deserves the finest.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className={`${buttonVariants({ size: "lg" })} bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 inline-flex items-center gap-2`}>
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections" className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-full px-8`}>
                Our Collections
              </Link>
            </div>
            <div className="flex gap-8 pt-4">
              {[{ value: "2K+", label: "Happy Pets" }, { value: "50+", label: "Premium Items" }, { value: "4.9★", label: "Avg Rating" }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold font-heading">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }} className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--gold-light)] to-[var(--cream)]">
              <Image
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&q=85"
                alt="Elegant dog in luxury setting"
                fill
                className="object-cover"
                priority
              />
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-6 left-6 bg-background rounded-2xl p-4 shadow-lg">
                <p className="text-xs text-muted-foreground">New Arrival</p>
                <p className="font-semibold text-sm">Summer Luxe Collection</p>
                <p className="text-[var(--gold)] font-bold">From $89</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
