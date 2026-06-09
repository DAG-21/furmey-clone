"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ProductCard } from "@/components/products/ProductCard"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/types"

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">Handpicked</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">Featured Products</h2>
          </div>
          <Link href="/shop" className={`${buttonVariants({ variant: "outline" })} w-fit rounded-full inline-flex items-center gap-2`}>
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
