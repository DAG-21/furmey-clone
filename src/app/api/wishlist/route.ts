import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { orderBy: { order: "asc" } } } },
        },
      },
    },
  })

  return NextResponse.json(wishlist ?? { items: [] })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId } = await req.json()

  let wishlist = await prisma.wishlist.findUnique({ where: { userId: session.user.id } })
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: session.user.id } })
  }

  const existing = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  })

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    return NextResponse.json({ action: "removed" })
  } else {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    })
    return NextResponse.json({ action: "added" })
  }
}
