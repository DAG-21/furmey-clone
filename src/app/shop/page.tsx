import { Suspense } from "react"
import { ProductGrid } from "@/components/products/ProductGrid"
import { ProductFilters } from "@/components/products/ProductFilters"
import prisma from "@/lib/prisma"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Metadata } from "next"
import type { Product } from "@/types"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of luxury pet fashion and accessories.",
}

interface ShopPageProps {
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    priceMin?: string
    priceMax?: string
    inStock?: string
    sortBy?: string
    page?: string
    featured?: string
  }>
}

async function getProducts(searchParams: Awaited<ShopPageProps["searchParams"]>) {
  const categories = typeof searchParams.category === "string"
    ? [searchParams.category]
    : (searchParams.category ?? [])
  const priceMin = Number(searchParams.priceMin ?? 0)
  const priceMax = Number(searchParams.priceMax ?? 999999)
  const inStock = searchParams.inStock === "true"
  const featured = searchParams.featured === "true"
  const search = searchParams.search ?? ""
  const sortBy = searchParams.sortBy ?? "createdAt_desc"
  const page = Number(searchParams.page ?? 1)
  const limit = 12

  const [sortField, sortDir] = sortBy.split("_") as [string, "asc" | "desc"]
  const orderBy: Record<string, string> = {}
  if (sortField === "price") orderBy.price = sortDir ?? "asc"
  else if (sortField === "name") orderBy.name = sortDir ?? "asc"
  else orderBy.createdAt = sortDir ?? "desc"

  const where = {
    published: true,
    ...(featured && { featured: true }),
    ...(search && { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] }),
    ...(categories.length > 0 && { category: { slug: { in: categories } } }),
    price: { gte: priceMin, lte: priceMax === 999999 ? 999999 : priceMax },
    ...(inStock && { inventory: { quantity: { gt: 0 } } }),
  }

  const [products, total, allCategories] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: { category: true, images: { orderBy: { order: "asc" } }, variants: true, inventory: true, _count: { select: { reviews: true } } } }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return { products: products as unknown as Product[], total, allCategories, page, limit }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const { products, total, allCategories, page, limit } = await getProducts(params)
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          {params.search ? `Search: "${params.search}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground mt-1">{total} product{total !== 1 ? "s" : ""} found</p>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <ProductFilters categories={allCategories} maxPrice={500} />
          </Suspense>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4">
            <Sheet>
              <SheetTrigger className={`${buttonVariants({ variant: "outline", size: "sm" })} lg:hidden gap-2 inline-flex items-center`}>
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-4">
                  <Suspense fallback={null}>
                    <ProductFilters categories={allCategories} maxPrice={500} />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>

            <Select defaultValue={params.sortBy ?? "createdAt_desc"}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="name_asc">Name: A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                const sp = new URLSearchParams()
                if (params.search) sp.set("search", params.search)
                sp.set("page", String(p))
                return (
                  <Link key={p} href={`/shop?${sp.toString()}`} className={buttonVariants({ variant: p === page ? "default" : "outline", size: "sm" })}>
                    {p}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
