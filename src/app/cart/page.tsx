"use client"

import { useCartStore } from "@/store/cart"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const shipping = items.length > 0 ? (subtotal() >= 150 ? 0 : 12.99) : 0
  const total = subtotal() + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/shop" className={`${buttonVariants({ variant: "ghost", size: "sm" })} inline-flex items-center gap-1`}>
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
        <h1 className="font-heading text-3xl font-bold">Shopping Cart {items.length > 0 && `(${items.length})`}</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
          <div>
            <p className="text-xl font-medium">Your cart is empty</p>
            <p className="text-muted-foreground mt-1">Add some luxury to your pet&apos;s wardrobe</p>
          </div>
          <Link href="/shop" className={`${buttonVariants({ size: "lg" })} bg-foreground text-background hover:bg-foreground/90`}>Shop Now</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 bg-card border rounded-xl p-4">
                  <Link href={`/shop/${item.product.slug}`} className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.product.image || "/placeholder-product.jpg"} alt={item.product.name} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/shop/${item.product.slug}`} className="font-medium hover:text-[var(--gold)] line-clamp-1">{item.product.name}</Link>
                        {item.variantLabel && <p className="text-sm text-muted-foreground">{item.variantLabel}</p>}
                      </div>
                      <p className="font-semibold flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-card border rounded-xl p-6 h-fit space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${subtotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders over $150</p>}
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <div className="flex gap-2">
              <Input placeholder="Coupon code" className="h-9" />
              <Button variant="outline" size="sm" className="h-9">Apply</Button>
            </div>
            <Button size="lg" className="w-full bg-foreground text-background hover:bg-foreground/90">Proceed to Checkout</Button>
            <p className="text-xs text-muted-foreground text-center">Secure checkout. Your payment info is never stored.</p>
          </div>
        </div>
      )}
    </div>
  )
}
