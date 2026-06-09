import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  email: z.email(),
  otp: z.string().length(6),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const { email, otp } = parsed.data

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email },
  })

  if (!record) {
    return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })
    return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 })
  }

  const valid = await bcrypt.compare(otp, record.token)
  if (!valid) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 })
  }

  // OTP is correct — keep record so the reset-password step can re-verify it
  // (will be cleaned up after password is reset)
  return NextResponse.json({ ok: true })
}
