"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

interface SearchFormProps {
  defaultValue?: string
  className?: string
}

export function SearchForm({ defaultValue = "", className = "" }: SearchFormProps) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("q") as string
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Cari drama..."
          defaultValue={defaultValue}
          className="w-64 rounded-full bg-gray-800 pl-8 text-sm text-white placeholder:text-gray-400 focus-visible:ring-rose-500"
        />
      </div>
    </form>
  )
} 