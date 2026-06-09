"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reviewSchema, type ReviewInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import type { Review } from "@/types"

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 transition-colors ${
            star <= (hovered || rating)
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "text-muted-foreground"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  )
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const { data: session } = useSession()
  const [optimisticReviews, setOptimisticReviews] = useState(reviews)
  const [submitting, setSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(5)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema) })

  const onSubmit = async (data: ReviewInput) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating: selectedRating, productId }),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      const review = await res.json()
      setOptimisticReviews((prev) => [review, ...prev])
      reset()
      setSelectedRating(5)
      toast.success("Review submitted!")
    } catch {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating =
    optimisticReviews.length > 0
      ? optimisticReviews.reduce((acc, r) => acc + r.rating, 0) / optimisticReviews.length
      : 0

  return (
    <div className="space-y-8">
      {/* Summary */}
      {optimisticReviews.length > 0 && (
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
            <StarRating rating={Math.round(avgRating)} />
            <p className="text-sm text-muted-foreground mt-1">
              {optimisticReviews.length} review{optimisticReviews.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      <Separator />

      {/* Review form */}
      {session ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold">Write a Review</h3>
          <div>
            <Label className="mb-2 block">Rating</Label>
            <StarRating rating={selectedRating} interactive onRate={setSelectedRating} />
          </div>
          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" {...register("title")} className="mt-1" placeholder="Summarize your review" />
          </div>
          <div>
            <Label htmlFor="body">Review</Label>
            <Textarea
              id="body"
              {...register("body")}
              className="mt-1"
              rows={4}
              placeholder="What did you think of this product?"
            />
            {errors.body && (
              <p className="text-xs text-destructive mt-1">{errors.body.message}</p>
            )}
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            <a href="/login" className="text-[var(--gold)] hover:underline">Sign in</a>{" "}
            to write a review
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        {optimisticReviews.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
        {optimisticReviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.user.image ?? ""} />
                  <AvatarFallback>{review.user.name?.[0]?.toUpperCase() ?? "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{review.user.name ?? "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
            </div>
            {review.title && <p className="font-medium text-sm">{review.title}</p>}
            {review.body && <p className="text-sm text-muted-foreground">{review.body}</p>}
            <Separator />
          </div>
        ))}
      </div>
    </div>
  )
}
