import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") ?? ""
  const categories = searchParams.getAll("category")
  const priceMin = Number(searchParams.get("priceMin") ?? 0)
  const priceMax = Number(searchParams.get("priceMax") ?? 999999)
  const inStock = searchParams.get("inStock") === "true"
  const featured = searchParams.get("featured") === "true"
  const sortBy = searchParams.get("sortBy") ?? "createdAt_desc"
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 12)

  const [sortField, sortDir] = sortBy.split("_") as [string, "asc" | "desc"]

  const where = {
    published: true,
    ...(featured && { featured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { tags: { has: search } },
      ],
    }),
    ...(categories.length > 0 && {
      category: { slug: { in: categories } },
    }),
    price: { gte: priceMin, lte: priceMax },
    ...(inStock && {
      inventory: { quantity: { gt: 0 } },
    }),
  }

  const orderBy: Record<string, string> = {}
  if (sortField === "price") orderBy.price = sortDir
  else if (sortField === "name") orderBy.name = sortDir
  else orderBy.createdAt = sortDir ?? "desc"

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
        inventory: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, limit })
}
