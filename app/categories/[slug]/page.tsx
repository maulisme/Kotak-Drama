import Link from "next/link"

import { DramaCard } from "@/components/drama-card"
import { Drama } from "@/types/drama"

interface Category {
  id: number
  name: string
  replaceName: string
}

async function fetchCategories() {
  try {
    const response = await fetch('https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/genres.json')
    const data = await response.json()
    return {
      categories: [
        { id: 0, name: "Semua", replaceName: "all" },
        ...data.pageProps.types.filter((type: Category) => type.id !== 0)
      ],
      dramas: data.pageProps.bookList.map((item: any): Drama => ({
        id: item.originalBookId,
        title: item.bookName,
        year: 2024,
        genre: item.typeTwoList?.map((t: any) => t.name).join(', ') || '',
        poster: item.cover,
        bookNameLower: item.bookNameLower,
        videoUrl: `/watch/${item.bookNameLower}`,
      }))
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { categories: [], dramas: [] }
  }
}

async function fetchCategoryContent(slug: string) {
  try {
    // First fetch all categories to get the ID for the slug
    const categoriesResponse = await fetch('https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/genres.json')
    const categoriesData = await categoriesResponse.json()
    
    // Find the category by slug (replaceName)
    const category = categoriesData.pageProps.types.find((type: Category) => 
      type.replaceName.toLowerCase() === slug.toLowerCase()
    )

    if (!category) {
      return { category: null, dramas: [] }
    }

    // Fetch category-specific content using the category ID
    const response = await fetch(`https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/genres/${category.id}.json?typeTwoId=${category.id}`)
    const data = await response.json()
    
    // Map the dramas from the category-specific endpoint
    const dramas = data.pageProps.bookList.map((item: any): Drama => ({
      id: item.originalBookId,
      title: item.bookName,
      year: 2024,
      genre: item.typeTwoList?.map((t: any) => t.name).join(', ') || '',
      poster: item.cover,
      bookNameLower: item.bookNameLower,
      videoUrl: `/watch/${item.bookNameLower}`,
      jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.originalBookId}/${item.bookNameLower}.json`
    }))

    return {
      category,
      dramas
    }
  } catch (error) {
    console.error('Error fetching category content:', error)
    return { category: null, dramas: [] }
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const { categories } = await fetchCategories()
  const { category, dramas } = await fetchCategoryContent(params.slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold">Kategori Tidak Ditemukan</h1>
        </header>
        <div className="border-b border-gray-800 bg-black/50 px-4 py-3 md:px-6">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-white"
          >
            &lt; Kembali ke Kategori
          </Link>
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-gray-400">Kategori yang Anda cari tidak ditemukan.</p>
            <Link 
              href="/categories" 
              className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              Lihat Semua Kategori
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">{category.name}</h1>
      </header>
      <div className="border-b border-gray-800 bg-black/50 px-4 py-3 md:px-6">
        <Link 
          href="/categories" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white"
        >
          &lt; Kembali ke Kategori
        </Link>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium">Pilih Kategori</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={cat.id === 0 ? '/categories' : `/categories/${cat.replaceName}`}
                className={`flex items-center justify-center rounded-lg p-4 text-center transition-colors ${
                  cat.id === category.id 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {dramas.map((drama: Drama) => (
            <DramaCard key={drama.id} drama={drama} />
          ))}
        </div>
      </main>
    </div>
  )
} 