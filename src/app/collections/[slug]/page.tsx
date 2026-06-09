import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProductGrid } from "@/components/products/ProductGrid"
import type { Metadata } from "next"
import type { Product } from "@/types"

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = await prisma.collection.findUnique({ where: { slug } })
  return {
    title: collection?.name ?? "Collection",
    description: collection?.description ?? undefined,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { order: "asc" },
        include: {
          product: {
            include: {
              category: true,
              images: { orderBy: { order: "asc" } },
              variants: true,
              inventory: true,
              _count: { select: { reviews: true } },
            },
          },
        },
      },
    },
  })

  if (!collection) notFound()

  const products = collection.products.map((cp) => cp.product) as unknown as Product[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[var(--gold-light)] to-muted p-8 md:p-16 mb-12 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[200px]">
          ✨
        </div>
        <div className="relative">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">Collection</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{collection.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">{products.length} products</p>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  )
}
