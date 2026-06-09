import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, Users, ShoppingBag, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Admin Dashboard" }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard")

  const [
    totalProducts,
    totalUsers,
    totalOrders,
    recentOrders,
    lowStockProducts,
    revenueData,
  ] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.product.findMany({
      where: { inventory: { quantity: { lte: 5 } } },
      include: { inventory: true, category: true },
      take: 10,
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ])

  const totalRevenue = revenueData._sum.total ?? 0

  const statusColors: Record<string, string> = {
    PENDING: "secondary",
    CONFIRMED: "default",
    PROCESSING: "default",
    SHIPPED: "default",
    DELIVERED: "outline",
    CANCELLED: "destructive",
    REFUNDED: "secondary",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your Furmey store</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          Admin Panel
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, trend: "+12% this month" },
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag, trend: "All time" },
          { label: "Active Products", value: totalProducts, icon: Package, trend: "Published" },
          { label: "Total Users", value: totalUsers, icon: Users, trend: "Registered" },
        ].map(({ label, value, icon: Icon, trend }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">
            <ShoppingBag className="h-4 w-4 mr-2" /> Orders
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" /> Low Stock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">#{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.user.name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[order.status] as "secondary" | "default" | "outline" | "destructive"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="font-medium text-sm hover:text-[var(--gold)]"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{product.category.name}</TableCell>
                      <TableCell>
                        <Badge variant={product.inventory?.quantity === 0 ? "destructive" : "secondary"}>
                          {product.inventory?.quantity ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        All products are well stocked! 🎉
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
