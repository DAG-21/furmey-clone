"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState } from "react"

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@furmey.com" },
  { icon: Phone, label: "Phone", value: "+1 (800) FUR-MEOW" },
  { icon: MapPin, label: "Address", value: "12 Rue de la Mode, Paris, France" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm CET" },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (_data: ContactInput) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll be in touch within 24 hours.")
    reset()
    setSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Get In Touch
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">Contact Us</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Have a question about sizing, shipping, or a custom order? We&apos;re here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} className="mt-1" placeholder="Your name" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register("subject")} className="mt-1" placeholder="How can we help?" />
            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              className="mt-1"
              rows={6}
              placeholder="Tell us more about your inquiry..."
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-foreground text-background hover:bg-foreground/90"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* Info */}
        <div className="space-y-8">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-[var(--gold-light)] to-muted flex items-center justify-center text-6xl">
            📮
          </div>
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--gold-light)] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-muted-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
