"use client"

import { useWishlistStore } from "@/store/wishlist"
import { useCartStore } from "@/store/cart"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.id,
      variantId: null,
      quantity: 1,
      product: { id: item.id, name: item.name, slug: item.slug, price: item.price, image: item.image },
      variantLabel: null,
    })
    openCart()
    toast.success(`${item.name} added to cart`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Heart className="h-7 w-7" /> Wishlist
          {items.length > 0 && <Badge variant="secondary">{items.length}</Badge>}
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/30" />
          <div>
            <p className="text-xl font-medium">Your wishlist is empty</p>
            <p className="text-muted-foreground mt-1">Save items you love to your wishlist</p>
          </div>
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((item) => {
              const discount = item.comparePrice
                ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                : null
              return (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="group relative">
                  <Link href={`/shop/${item.slug}`} className="block">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-3">
                      <Image src={item.image || "/placeholder-product.jpg"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {discount && <Badge className="absolute top-2 left-2 bg-[var(--gold)] text-foreground border-0">-{discount}%</Badge>}
                      <button onClick={(e) => { e.preventDefault(); removeItem(item.id); toast.info("Removed from wishlist") }} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      {item.comparePrice && <span className="text-sm text-muted-foreground line-through">${item.comparePrice.toFixed(2)}</span>}
                    </div>
                  </Link>
                  <Button size="sm" className="w-full mt-2 bg-foreground text-background hover:bg-foreground/90" onClick={() => handleAddToCart(item)}>
                    <ShoppingBag className="h-4 w-4 mr-1" /> Add to Cart
                  </Button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
