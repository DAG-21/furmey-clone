"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Menu,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { totalItems, openCart } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const cartCount = totalItems()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-heading text-2xl font-bold tracking-tight">
            Fur<span className="text-[var(--gold)]">mey</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--gold)] ${
                pathname === link.href
                  ? "text-[var(--gold)]"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              onSubmit={handleSearch}
              className="hidden md:flex"
            >
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-8 text-sm"
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
            </motion.form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`${buttonVariants({ variant: "ghost", size: "icon" })} relative`}
          >
            <Heart className="h-4 w-4" />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[var(--gold)] text-white border-0">
                {wishlistItems.length}
              </Badge>
            )}
          </Link>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[var(--gold)] text-white border-0">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={session.user?.image ?? ""} />
                  <AvatarFallback>
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{session.user?.name}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground truncate">{session.user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                {(session.user as { role?: string })?.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="flex items-center gap-2 cursor-pointer">
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <User className="h-4 w-4" />
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <span className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <Menu className="h-4 w-4" />
              </span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                  />
                  <Button type="submit" size="icon" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-base font-medium transition-colors hover:text-[var(--gold)] ${
                        pathname === link.href ? "text-[var(--gold)]" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                {!session && (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className={buttonVariants()}>Sign In</Link>
                    <Link href="/register" className={buttonVariants({ variant: "outline" })}>Create Account</Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
