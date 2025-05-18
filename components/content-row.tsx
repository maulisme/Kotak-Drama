import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Drama } from "@/types/drama"
import { DramaCard } from "@/components/drama-card"

interface ContentRowProps {
  title: string
  items: Drama[]
  viewAllLink?: string
}

export function ContentRow({ title, items, viewAllLink }: ContentRowProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((drama) => (
          <DramaCard key={drama.id} drama={drama} />
        ))}
      </div>
    </div>
  )
}
