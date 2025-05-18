import Link from "next/link"

import { SearchForm } from "@/components/search-form"
import { DramaCard } from "@/components/drama-card"
import { Drama } from "@/types/drama"

async function searchDramas(query: string) {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/search.json?searchValue=${encodedQuery}`)
    const data = await response.json()
    
    if (!data.pageProps.bookList) return []
    
    return data.pageProps.bookList.map((item: any): Drama => ({
      id: item.bookId,
      title: item.bookName,
      year: 2024,
      genre: item.typeTwoList?.map((t: any) => t.name).join(', ') || '',
      poster: item.coverWap,
      bookNameLower: item.bookNameLower,
      videoUrl: `/watch/${item.bookNameLower}`,
      jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.bookId}/${item.bookNameLower}.json`
    }))
  } catch (error) {
    console.error('Error searching dramas:', error)
    return []
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const dramas = query ? await searchDramas(query) : []

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">Hasil Pencarian</h1>
        <div className="hidden md:block">
          <SearchForm defaultValue={query} />
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
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-medium">
              Hasil pencarian untuk "{query}"
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Ditemukan {dramas.length} drama
            </p>
          </div>
        )}
        {dramas.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {dramas.map((drama: Drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-gray-400">Tidak ditemukan hasil yang relevan.</p>
            <p className="mt-2 text-sm text-gray-500">
              Coba kata kunci lain atau periksa ejaan Anda.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  )
} 