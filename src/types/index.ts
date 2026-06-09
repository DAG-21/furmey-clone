export interface ProductImage {
  id: string
  url: string
  alt: string | null
  isPrimary: boolean
  order: number
}

export interface Variant {
  id: string
  name: string
  value: string
  price: number | null
  sku: string | null
  stock: number
  image: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  featured: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  comparePrice: number | null
  sku: string
  featured: boolean
  published: boolean
  tags: string[]
  category: Category
  images: ProductImage[]
  variants: Variant[]
  inventory: { quantity: number; reserved: number } | null
  reviews?: Review[]
  _count?: { reviews: number }
}

export interface Review {
  id: string
  rating: number
  title: string | null
  body: string | null
  verified: boolean
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

export interface CartItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  product: Pick<Product, "id" | "name" | "slug" | "price" | "images">
  variant: Variant | null
}

export interface WishlistItem {
  id: string
  productId: string
  product: Pick<Product, "id" | "name" | "slug" | "price" | "comparePrice" | "images">
}

export interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: Pick<Product, "id" | "name" | "slug" | "images">
}

export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string | null
  isDefault: boolean
}

export interface FilterState {
  categories: string[]
  priceMin: number
  priceMax: number
  sortBy: string
  search: string
  inStock: boolean
}
