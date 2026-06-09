import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  image: string
}

export interface LocalCartItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  product: CartProduct
  variantLabel: string | null
}

interface CartStore {
  items: LocalCartItem[]
  isOpen: boolean
  addItem: (item: Omit<LocalCartItem, "id">) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existing = items.find(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId
        )
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              { ...item, id: `${item.productId}-${item.variantId ?? "default"}-${Date.now()}` },
            ],
          })
        }
      },

      removeItem: (itemId) =>
        set({ items: get().items.filter((i) => i.id !== itemId) }),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    { name: "furmey-cart" }
  )
)
