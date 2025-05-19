import Link from "next/link"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { DramaCard } from "@/components/drama-card"
import { Drama } from "@/types/drama"

async function fetchTrendingDramas() {
  try {
    const response = await fetch('https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/channel/trending.json')
    const data = await response.json()
    return data.pageProps.moreData.items.map((item: any): Drama => ({
      id: item.originalBookId,
      title: item.name,
      year: 2024,
      genre: item.tags?.join(', ') || item.typeTwoName || '',
      poster: item.cover,
      bookNameLower: item.bookNameLower,
      videoUrl: `/watch/${item.bookNameLower}`,
      jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.originalBookId}/${item.bookNameLower}.json`
    }))
  } catch (error) {
    console.error('Error fetching trending dramas:', error)
    return []
  }
}

export default async function TrendingPage() {
  const dramas = await fetchTrendingDramas()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">Sedang Trending</h1>
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari drama..."
            className="w-64 rounded-full bg-gray-800 pl-8 text-sm text-white placeholder:text-gray-400 focus-visible:ring-rose-500"
          />
        </div>
      </header>
      <div className="border-b border-gray-800 bg-black/50 px-4 py-3 md:px-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white"
        >
          &lt; Kembali
        </Link>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {dramas.map((drama: Drama) => (
            <DramaCard key={drama.id} drama={drama} />
          ))}
        </div>
      </main>
    </div>
  )
} 