import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const footerLinks = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/collections", label: "Collections" },
    { href: "/shop?featured=true", label: "New Arrivals" },
    { href: "/shop?sale=true", label: "Sale" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/about#careers", label: "Careers" },
    { href: "/about#press", label: "Press" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns" },
    { href: "/size-guide", label: "Size Guide" },
  ],
}

const socialLinks = [
  { label: "Instagram", href: "#", icon: "📸" },
  { label: "Twitter", href: "#", icon: "𝕏" },
  { label: "Facebook", href: "#", icon: "f" },
  { label: "YouTube", href: "#", icon: "▶" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-2xl font-bold tracking-tight text-background">
                Fur<span className="text-[var(--gold)]">mey</span>
              </span>
            </Link>
            <p className="text-sm text-background/70 mb-6 max-w-xs">
              Dressing pets in luxury since 2019. Because your beloved companions deserve nothing but the finest.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium mb-2">Stay in the loop</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 h-9"
                />
                <Button size="sm" className="bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-foreground border-0 h-9 px-4">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-[var(--gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-[var(--gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-[var(--gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-background/20 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Furmey. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-background/60 hover:text-[var(--gold)] transition-colors text-sm font-medium"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-sm text-background/60">
            <Link href="/privacy" className="hover:text-[var(--gold)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--gold)]">Terms</Link>
            <Link href="/cookies" className="hover:text-[var(--gold)]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
