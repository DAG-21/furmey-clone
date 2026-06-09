import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { randomInt } from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/mailer"

const schema = z.object({ email: z.email() })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
  }

  const { email } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Return success anyway to avoid email enumeration
    return NextResponse.json({ ok: true })
  }

  // Generate 6-digit OTP
  const otp = String(randomInt(100000, 999999))
  const hashed = await bcrypt.hash(otp, 10)
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 min

  // Upsert into VerificationToken (identifier = email)
  await prisma.verificationToken.deleteMany({ where: { identifier: email } })
  await prisma.verificationToken.create({
    data: { identifier: email, token: hashed, expires },
  })

  await sendOtpEmail(email, otp)

  return NextResponse.json({ ok: true })
}
