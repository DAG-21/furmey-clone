import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedCollections } from "@/components/home/FeaturedCollections"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { Testimonials } from "@/components/home/Testimonials"
import { NewsletterSection } from "@/components/home/NewsletterSection"
import prisma from "@/lib/prisma"

async function getHomeData() {
  const [collections, products] = await Promise.all([
    prisma.collection.findMany({
      where: { featured: true },
      take: 3,
    }),
    prisma.product.findMany({
      where: { featured: true, published: true },
      take: 8,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
        inventory: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])
  return { collections, products }
}

export default async function HomePage() {
  const { collections, products } = await getHomeData()

  return (
    <>
      <HeroSection />
      <FeaturedCollections collections={collections} />
      <FeaturedProducts products={products} />
      <Testimonials />
      <NewsletterSection />
    </>
  )
}
