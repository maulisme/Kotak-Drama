'use client'

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Drama } from "@/types/drama"

interface DramaCardProps {
  drama: Drama
}

export function DramaCard({ drama }: DramaCardProps) {
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (drama.jsonUrl) {
      try {
        const response = await fetch(drama.jsonUrl)
        const data = await response.json()
        localStorage.setItem('movieData', JSON.stringify(data))
        router.push(drama.videoUrl)
      } catch (error) {
        console.error('Error fetching movie data:', error)
      }
    }
  }

  return (
    <Link href={drama.videoUrl} onClick={handleClick} className="group">
      <div className="overflow-hidden rounded-md">
        <div className="aspect-[2/3] relative">
          <Image
            src={drama.poster || "/placeholder.svg"}
            alt={drama.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-2">
          <h3 className="font-medium line-clamp-2">{drama.title}</h3>
          <p className="text-xs text-gray-400">{drama.genre}</p>
        </div>
      </div>
    </Link>
  )
} 