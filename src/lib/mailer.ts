import nodemailer from "nodemailer"

async function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Dev fallback: Ethereal test account — preview URL is logged to console
  const testAccount = await nodemailer.createTestAccount()
  console.log("\n[mailer] No SMTP_HOST set — using Ethereal test account")
  console.log(`[mailer] User: ${testAccount.user}`)
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
}

export async function sendOtpEmail(to: string, otp: string) {
  const transport = await createTransport()
  const from = process.env.SMTP_FROM ?? '"Furmey" <no-reply@furmey.com>'

  const info = await transport.sendMail({
    from,
    to,
    subject: "Your Furmey password reset code",
    text: `Your one-time password reset code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#c9a84c;font-family:Georgia,serif">Furmey</h2>
        <p>You requested a password reset. Use the code below to continue:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px;background:#f9f5ef;border-radius:12px;margin:24px 0">
          ${otp}
        </div>
        <p style="color:#666;font-size:14px">This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })

  // In dev with Ethereal, log the preview URL so you can read the email in a browser
  const preview = nodemailer.getTestMessageUrl(info)
  if (preview) {
    console.log(`[mailer] Preview URL: ${preview}`)
  }
}
