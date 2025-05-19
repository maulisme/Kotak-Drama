"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Info } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FeaturedContentProps {
  featured: any[]
}

export function FeaturedContent({ featured }: FeaturedContentProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const router = useRouter()

  const autoplay = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(autoplay, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [emblaApi, autoplay])

  const handleClick = async (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    if (item.jsonUrl) {
      try {
        const response = await fetch(item.jsonUrl)
        const data = await response.json()
        localStorage.setItem('movieData', JSON.stringify(data))
        router.push(item.videoUrl)
      } catch (error) {
        console.error('Error fetching movie data:', error)
      }
    }
  }

  return (
    <div className="relative">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {featured.map((item) => (
            <div key={item.id} className="embla__slide relative flex-[0_0_100%]">
              <div className="relative h-[70vh] w-full">
                <div data-book-id={item.id} className="hidden" />
                <Image
                  src={item.backdrop || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-10">
                  <div className="flex max-w-3xl flex-col gap-4">
                    <Badge className="w-fit bg-[#00d4bd] text-white hover:bg-[#00bca7]">{item.type}</Badge>
                    <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{item.title}</h1>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-300">                      
                      <span>•</span>
                      <span>{item.episodes?.length || 16} Episode</span>
                      <span>•</span>
                      <span>{item.genre}</span>
                    </div>
                    <p className="text-gray-200 line-clamp-3 md:line-clamp-4">{item.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="gap-2 bg-[#00d4bd] hover:bg-[#00bca7]"
                        onClick={(e) => handleClick(e, item)}
                      >
                        <Play className="h-4 w-4" />
                        Tonton Sekarang
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {featured.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full bg-white/50 transition-all hover:bg-white"
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
