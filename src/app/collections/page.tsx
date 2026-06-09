import Link from "next/link"
import { ArrowRight } from "lucide-react"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated luxury pet fashion collections.",
}

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      products: {
        take: 3,
        include: {
          product: { include: { images: { orderBy: { order: "asc" } } } },
        },
      },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Curated Collections
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">
          Our Collections
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Each collection tells a story — from casual chic to black-tie glamour for your beloved companion.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {collections.map((collection, index) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--gold-light)] to-muted"
            style={{ minHeight: index === 0 ? "400px" : "280px" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl opacity-20">
                {["🎀", "✨", "👑", "🌸", "💎", "🌿"][index % 6]}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {collection.featured && (
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)] block mb-2">
                  Featured
                </span>
              )}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                {collection.name}
              </h2>
              {collection.description && (
                <p className="text-white/75 text-sm mb-4 max-w-sm">{collection.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">
                  {collection._count.products} items
                </span>
                <span className="flex items-center gap-2 text-[var(--gold)] font-medium group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
