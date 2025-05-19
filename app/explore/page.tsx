import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DramaCard } from "@/components/drama-card"
import { Drama } from "@/types/drama"

interface ExplorePageProps {
  searchParams: { page?: string }
}

async function fetchExploreDramas(page: number = 0) {
  try {
    // Skip page 1 as it's invalid
    const actualPage = page >= 1 ? page + 1 : page
    const response = await fetch(`https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/genres/0/${actualPage}.json`)
    const data = await response.json()
    return {
      dramas: data.pageProps.bookList.map((item: any): Drama => ({
        id: item.originalBookId,
        title: item.bookName,
        year: 2024,
        genre: item.typeTwoList?.map((t: any) => t.name).join(', ') || '',
        poster: item.cover,
        bookNameLower: item.bookNameLower,
        videoUrl: `/watch/${item.bookNameLower}`,
        jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.originalBookId}/${item.bookNameLower}.json`
      })),
      totalPages: data.pageProps.pages || 1
    }
  } catch (error) {
    console.error('Error fetching explore dramas:', error)
    return { dramas: [], totalPages: 1 }
  }
}

function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const range: (number | string)[] = []
  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)

  // Always show first page
  range.push(0)

  // Calculate start and end of visible pages
  let start = Math.max(1, currentPage - halfVisible)
  let end = Math.min(totalPages - 1, start + maxVisiblePages - 2)

  // Adjust start if we're near the end
  if (end === totalPages - 1) {
    start = Math.max(1, end - maxVisiblePages + 2)
  }

  // Add ellipsis after first page if needed
  if (start > 1) {
    range.push('...')
  }

  // Add visible pages
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  // Add ellipsis before last page if needed
  if (end < totalPages - 1) {
    range.push('...')
  }

  // Add last page only if it's not already included
  if (totalPages > 1 && end < totalPages - 1) {
    range.push(totalPages - 1)
  }

  return range
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 0
  const { dramas, totalPages } = await fetchExploreDramas(currentPage)
  const paginationRange = getPaginationRange(currentPage, totalPages)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">Telusuri Drama</h1>
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
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 ${
              currentPage === 0 
                ? "opacity-50 cursor-not-allowed" 
                : "bg-slate-100 text-black hover:bg-slate-200"
            }`}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {paginationRange.map((page, index) => (
            page === '...' ? (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-slate-100 text-black hover:bg-slate-200"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                key={`page-${page}-${index}`}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${
                  currentPage === page 
                    ? "" 
                    : "bg-slate-100 text-black hover:bg-slate-200"
                }`}
                asChild
              >
                <Link href={`/explore?page=${page}`}>
                  {typeof page === 'number' ? page + 1 : page}
                </Link>
              </Button>
            )
          ))}
          
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 ${
              currentPage === totalPages - 1 
                ? "opacity-50 cursor-not-allowed" 
                : "bg-slate-100 text-black hover:bg-slate-200"
            }`}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
} 