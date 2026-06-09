import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About",
  description: "Learn the story behind Furmey — luxury pet fashion made with love.",
}

const team = [
  { name: "Sofia Laurent", role: "Founder & Creative Director", emoji: "👩‍🎨" },
  { name: "Marcus Chen", role: "Head of Product Design", emoji: "🧑‍💻" },
  { name: "Aisha Rahman", role: "Brand & Marketing Lead", emoji: "👩‍💼" },
]

const values = [
  {
    icon: "✨",
    title: "Craftsmanship",
    description: "Every Furmey piece is handcrafted using ethically sourced materials, ensuring both luxury and longevity.",
  },
  {
    icon: "🌿",
    title: "Sustainability",
    description: "We are committed to environmentally conscious practices — from materials to packaging.",
  },
  {
    icon: "❤️",
    title: "Animal Welfare",
    description: "Our designs prioritize comfort and safety. Happy pets, happy parents.",
  },
  {
    icon: "🎨",
    title: "Innovation",
    description: "We blend haute couture aesthetics with practical pet-friendly design.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Our Story
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2 mb-6">
          Where Luxury Meets Paws
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          Furmey was born from a simple belief: that the bond between humans and their pets is
          extraordinary, and that bond deserves to be celebrated in every detail — right down to
          what they wear.
        </p>
      </div>

      <Separator className="mb-16" />

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-[var(--gold-light)] to-muted flex items-center justify-center text-8xl">
          🐾
        </div>
        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-bold">How It All Began</h2>
          <p className="text-muted-foreground leading-relaxed">
            In 2019, founder Sofia Laurent was searching for a birthday gift for her beloved
            Cavalier King Charles Spaniel, Bijou. She found the market saturated with mass-produced
            items that lacked the elegance she sought.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            So she created Furmey — a brand dedicated to crafting pieces worthy of the most
            discerning pet parents. What started in a Parisian atelier now ships to over 40 countries.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16" id="values">
        <h2 className="font-heading text-3xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-2xl border p-6 space-y-3">
              <div className="text-4xl">{v.icon}</div>
              <h3 className="font-semibold text-lg">{v.title}</h3>
              <p className="text-muted-foreground text-sm">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16" id="team">
        <h2 className="font-heading text-3xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-4xl mx-auto">
                {member.emoji}
              </div>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-16" />

      {/* Press */}
      <div id="press" className="text-center space-y-6">
        <h2 className="font-heading text-2xl font-bold">As Seen In</h2>
        <div className="flex flex-wrap justify-center gap-8 text-muted-foreground/50 font-semibold text-lg">
          {["Vogue", "The Times", "Forbes", "Cosmopolitan"].map((pub) => (
            <span key={pub} className="tracking-wide">{pub}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
