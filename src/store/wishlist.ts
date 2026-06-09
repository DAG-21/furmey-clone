import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
}

interface WishlistStore {
  items: WishlistProduct[]
  addItem: (product: WishlistProduct) => void
  removeItem: (productId: string) => void
  toggleItem: (product: WishlistProduct) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set({ items: [...get().items, product] })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isWishlisted: (productId) =>
        get().items.some((i) => i.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "furmey-wishlist" }
  )
)
