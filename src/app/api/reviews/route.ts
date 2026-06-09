import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const reviewCreateSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(10),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const result = reviewCreateSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const { productId, rating, title, body: reviewBody } = result.data

  try {
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title,
        body: reviewBody,
      },
      include: { user: { select: { name: true, image: true } } },
    })
    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 })
  }
}
