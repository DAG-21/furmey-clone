import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Heart, MapPin, User, ShoppingBag } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

const statusColors: Record<string, string> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "outline",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        include: { items: { include: { product: { include: { images: { orderBy: { order: "asc" } } } } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      addresses: true,
      reviews: { include: { product: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } },
    },
  })

  if (!user) redirect("/login")

  const totalSpent = user.orders
    .filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
    .reduce((acc, o) => acc + o.total, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="text-xl">{user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-2xl font-bold">{user.name ?? "My Account"}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <Badge variant="secondary" className="mt-1">{user.role}</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: user.orders.length, icon: ShoppingBag },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: Package },
          { label: "Reviews", value: user.reviews.length, icon: User },
          { label: "Addresses", value: user.addresses.length, icon: MapPin },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" /> Orders
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2" /> Addresses
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Heart className="h-4 w-4 mr-2" /> Reviews
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="mt-6 space-y-4">
          {user.orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No orders yet.</p>
              <Link href="/shop" className="text-[var(--gold)] text-sm hover:underline">Start shopping</Link>
            </div>
          ) : (
            user.orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">#{order.orderNumber}</CardTitle>
                    <Badge variant={statusColors[order.status] as "secondary" | "default" | "outline" | "destructive"}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ${order.total.toFixed(2)}
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/shop/${item.product.slug}`}
                        className="text-sm text-muted-foreground hover:text-[var(--gold)]"
                      >
                        {item.product.name} ×{item.quantity}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses" className="mt-6">
          {user.addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No saved addresses.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <Card key={addr.id}>
                  <CardContent className="pt-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{addr.label}</p>
                      {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                    <p className="text-sm">{addr.firstName} {addr.lastName}</p>
                    <p className="text-sm text-muted-foreground">{addr.street}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-muted-foreground">{addr.country}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews" className="mt-6 space-y-4">
          {user.reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven&apos;t written any reviews yet.</p>
            </div>
          ) : (
            user.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6 space-y-2">
                  <Link href={`/shop/${review.product.slug}`} className="font-medium hover:text-[var(--gold)]">
                    {review.product.name}
                  </Link>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-sm ${s <= review.rating ? "text-[var(--gold)]" : "text-muted-foreground"}`}>★</span>
                    ))}
                  </div>
                  {review.title && <p className="font-medium text-sm">{review.title}</p>}
                  {review.body && <p className="text-sm text-muted-foreground">{review.body}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
