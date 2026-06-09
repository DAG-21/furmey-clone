"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductReviews } from "@/components/products/ProductReviews"
import { ProductCard } from "@/components/products/ProductCard"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { toast } from "sonner"
import { Heart, ShoppingBag, Star, ChevronLeft } from "lucide-react"
import type { Product } from "@/types"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { addItem, openCart } = useCartStore()
  const { toggleItem, isWishlisted } = useWishlistStore()

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product)
        setRelated(data.related ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded mb-8" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-10 w-3/4 bg-muted rounded" />
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) notFound()

  const wishlisted = isWishlisted(product.id)
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const inStock = (product.inventory?.quantity ?? 0) > 0

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0

  const handleAddToCart = () => {
    const variant = product.variants.find((v) => v.id === selectedVariant)
    addItem({
      productId: product.id,
      variantId: selectedVariant,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: variant?.price ?? product.price,
        image: primaryImage?.url ?? "",
      },
      variantLabel: variant ? `${variant.name}: ${variant.value}` : null,
    })
    openCart()
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: primaryImage?.url ?? "",
    })
    toast[wishlisted ? "info" : "success"](
      wishlisted ? "Removed from wishlist" : "Added to wishlist"
    )
  }

  const variantGroups = product.variants.reduce(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = []
      acc[v.name].push(v)
      return acc
    },
    {} as Record<string, typeof product.variants>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/shop" className="hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt ?? product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl">🐾</div>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i ? "border-[var(--gold)]" : "border-transparent"
                  }`}
                >
                  <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-[var(--gold)]"
            >
              {product.category.name}
            </Link>
            <h1 className="font-heading text-3xl font-bold mt-1">{product.name}</h1>

            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(avgRating)
                          ? "fill-[var(--gold)] text-[var(--gold)]"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({product.reviews?.length ?? 0} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            {product.comparePrice && (
              <Badge className="bg-[var(--gold)] text-foreground border-0">
                Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </Badge>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <Separator />

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="text-sm font-medium mb-2">
                {groupName}:{" "}
                <span className="font-normal text-muted-foreground">
                  {variants.find((v) => v.id === selectedVariant)?.value ?? "Select"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={v.stock === 0}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedVariant === v.id
                        ? "border-[var(--gold)] bg-[var(--gold-light)] text-foreground"
                        : "border-border hover:border-foreground"
                    } ${v.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(product.inventory?.quantity ?? 99, q + 1)
                  )
                }
              >
                +
              </Button>
              {product.inventory && (
                <span className="text-sm text-muted-foreground">
                  {product.inventory.quantity} available
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {inStock ? "Add to Cart" : "Sold Out"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
            >
              <Heart
                className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>SKU: {product.sku}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reviews" className="mb-16">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews?.length ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 prose max-w-none text-muted-foreground">
          <p>{product.description ?? "No description available."}</p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <ProductReviews
            productId={product.id}
            reviews={product.reviews ?? []}
          />
        </TabsContent>
      </Tabs>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
