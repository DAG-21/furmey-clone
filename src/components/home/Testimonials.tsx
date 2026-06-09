"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah M.",
    pet: "Golden Retriever mom",
    rating: 5,
    text: "The quality is absolutely stunning. My golden retriever Max gets so many compliments on his Furmey collar. Worth every penny!",
    initials: "SM",
  },
  {
    name: "James L.",
    pet: "French Bulldog parent",
    rating: 5,
    text: "I was skeptical about spending this much on pet accessories, but after seeing how well-made everything is, I'm converted. Baguette looks amazing!",
    initials: "JL",
  },
  {
    name: "Priya K.",
    pet: "Siamese cat owner",
    rating: 5,
    text: "Finally found a brand that takes pet fashion seriously. The packaging alone is beautiful, and the products are even better.",
    initials: "PK",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Pet Parents Love Us
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">
          What Our Community Says
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 border"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-[var(--gold-light)] text-foreground">
                  {t.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.pet}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
