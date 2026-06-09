"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success("You're on the list! Expect something special soon.")
    setEmail("")
    setLoading(false)
  }

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
            Exclusive Access
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-background">
            Join the Furmey Family
          </h2>
          <p className="text-background/70">
            Subscribe to our newsletter and get 15% off your first order, plus early access to new collections and exclusive member-only offers.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-foreground border-0 font-semibold px-8"
            >
              {loading ? "Joining..." : "Join Now"}
            </Button>
          </form>
          <p className="text-xs text-background/50">
            No spam, unsubscribe at any time. By subscribing you agree to our Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
