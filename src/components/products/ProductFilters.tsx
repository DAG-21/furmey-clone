"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import type { Category } from "@/types"

interface ProductFiltersProps {
  categories: Category[]
  maxPrice?: number
}

export function ProductFilters({ categories, maxPrice = 500 }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategories = searchParams.getAll("category")
  const priceMin = Number(searchParams.get("priceMin") ?? 0)
  const priceMax = Number(searchParams.get("priceMax") ?? maxPrice)
  const inStock = searchParams.get("inStock") === "true"

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      for (const [key, value] of Object.entries(updates)) {
        params.delete(key)
        if (value !== null) {
          if (Array.isArray(value)) value.forEach((v) => params.append(key, v))
          else params.set(key, value)
        }
      }
      router.push(`/shop?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      updateParams({ category: selectedCategories.filter((c) => c !== slug) })
    } else {
      updateParams({ category: [...selectedCategories, slug] })
    }
  }

  const clearFilters = () => router.push("/shop", { scroll: false })

  const hasFilters = selectedCategories.length > 0 || inStock || priceMin > 0 || priceMax < maxPrice

  return (
    <aside className="w-64 flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs gap-1">
            <X className="h-3 w-3" /> Clear all
          </Button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Category</h3>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <Checkbox
              id={`cat-${cat.slug}`}
              checked={selectedCategories.includes(cat.slug)}
              onCheckedChange={() => toggleCategory(cat.slug)}
            />
            <Label htmlFor={`cat-${cat.slug}`} className="text-sm cursor-pointer">{cat.name}</Label>
          </div>
        ))}
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={priceMin}
            min={0}
            max={priceMax}
            className="w-20 border rounded px-2 py-1 text-sm"
            onChange={(e) => updateParams({ priceMin: e.target.value })}
          />
          <span className="text-muted-foreground text-sm">–</span>
          <input
            type="number"
            value={priceMax}
            min={priceMin}
            max={maxPrice}
            className="w-20 border rounded px-2 py-1 text-sm"
            onChange={(e) => updateParams({ priceMax: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={inStock}
          onCheckedChange={(checked) => updateParams({ inStock: checked ? "true" : null })}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock Only</Label>
      </div>
    </aside>
  )
}
