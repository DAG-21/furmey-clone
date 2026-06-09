"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Collection } from "@/types"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface FeaturedCollectionsProps {
  collections: Collection[]
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  if (!collections.length) return null

  return (
    <section className="py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Curated For You
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">
          Shop by Collection
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {collections.slice(0, 3).map((collection, index) => (
          <motion.div key={collection.id} variants={item}>
            <Link
              href={`/collections/${collection.slug}`}
              className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--gold-light)] to-muted"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                {["🎀", "✨", "👑", "🌸", "💎"][index % 5]}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-white/80 text-sm line-clamp-2 mb-3">
                    {collection.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-[var(--gold)] text-sm font-medium group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
