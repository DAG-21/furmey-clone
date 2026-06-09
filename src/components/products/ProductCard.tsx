"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlistStore } from "@/store/wishlist"
import { useCartStore } from "@/store/cart"
import { toast } from "sonner"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isWishlisted } = useWishlistStore()
  const { addItem, openCart } = useCartStore()
  const wishlisted = isWishlisted(product.id)

  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0]
  const secondaryImage = product.images[1]

  const discount =
    product.comparePrice
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : null

  const reviewCount = product._count?.reviews ?? product.reviews?.length ?? 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: primaryImage?.url ?? "",
      },
      variantLabel: null,
    })
    openCart()
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: primaryImage?.url ?? "",
    })
    toast[wishlisted ? "info" : "success"](
      wishlisted ? "Removed from wishlist" : `${product.name} added to wishlist`
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-3">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt ?? product.name}
              fill
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <Badge className="bg-[var(--gold)] text-foreground border-0 text-xs">
                -{discount}%
              </Badge>
            )}
            {product.featured && (
              <Badge variant="secondary" className="text-xs">Featured</Badge>
            )}
            {product.inventory && product.inventory.quantity <= 5 && product.inventory.quantity > 0 && (
              <Badge variant="destructive" className="text-xs">
                Only {product.inventory.quantity} left
              </Badge>
            )}
            {product.inventory?.quantity === 0 && (
              <Badge variant="secondary" className="text-xs">Sold Out</Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleWishlist}
            >
              <Heart
                className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90 h-9 text-sm"
              onClick={handleAddToCart}
              disabled={product.inventory?.quantity === 0}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {product.inventory?.quantity === 0 ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--gold)] transition-colors">
            {product.name}
          </h3>
          {avgRating && reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" />
              <span className="text-xs text-muted-foreground">
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
