"use client"

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

type Step = "email" | "otp" | "done"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── Step 1: send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setEmailError(data.error ?? "Something went wrong.")
        return
      }
      toast.success("Check your inbox — a 6-digit code is on its way.")
      setStep("otp")
    } catch {
      setEmailError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── OTP box helpers ───────────────────────────────────────────────────────
  const focusBox = (index: number) => inputRefs.current[index]?.focus()

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    setOtpError("")
    if (char && index < 5) focusBox(index + 1)
  }

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusBox(index - 1)
    }
    if (e.key === "ArrowLeft" && index > 0) focusBox(index - 1)
    if (e.key === "ArrowRight" && index < 5) focusBox(index + 1)
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    pasted.split("").forEach((c, i) => { next[i] = c })
    setDigits(next)
    focusBox(Math.min(pasted.length, 5))
  }

  // ── Step 2: verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = digits.join("")
    if (otp.length < 6) {
      setOtpError("Enter all 6 digits.")
      return
    }
    setLoading(true)
    setOtpError("")
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data.error ?? "Invalid code.")
        return
      }
      setStep("done")
    } catch {
      setOtpError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setDigits(["", "", "", "", "", ""])
    setOtpError("")
    setLoading(true)
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      toast.success("New code sent!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-heading text-3xl font-bold">
            Fur<span className="text-[var(--gold)]">mey</span>
          </Link>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">

          {/* ── Step: email ─────────────────────────────────────── */}
          {step === "email" && (
            <>
              <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold">Forgot password?</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Enter your email and we&apos;ll send you a 6-digit code.
                </p>
              </div>

              {emailError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{emailError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  disabled={loading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {loading ? "Sending…" : "Send code"}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to login
                </Link>
              </div>
            </>
          )}

          {/* ── Step: OTP ───────────────────────────────────────── */}
          {step === "otp" && (
            <>
              <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold">Enter your code</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              {otpError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{otpError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6-box OTP input */}
                <div className="flex justify-between gap-2">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={handlePaste}
                      suppressHydrationWarning
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-transparent focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/40 transition-all"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  disabled={loading || digits.join("").length < 6}
                >
                  {loading ? "Verifying…" : "Verify code"}
                </Button>
              </form>

              <div className="mt-5 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    suppressHydrationWarning
                    className="text-[var(--gold)] hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setDigits(["", "", "", "", "", ""]); setOtpError("") }}
                  suppressHydrationWarning
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email
                </button>
              </div>
            </>
          )}

          {/* ── Step: done ──────────────────────────────────────── */}
          {step === "done" && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
              <div>
                <h1 className="font-heading text-2xl font-bold">Code verified!</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Your identity has been confirmed.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Password reset coming soon. For now,{" "}
                <Link href="/login" className="text-[var(--gold)] hover:underline">
                  return to login
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
