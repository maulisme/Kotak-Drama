import Link from "next/link"
import { Bell, User, Facebook, Twitter, Instagram, Youtube, Search, Menu, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { FeaturedContent } from "@/components/featured-content"
import { ContentRow } from "@/components/content-row"
import { getDramaData } from "@/lib/drama-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default async function HomePage() {
  const dramaData = await getDramaData()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#00d4bd]">
            <span>KotakDrama</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="text-sm font-medium hover:text-rose-400">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm font-medium hover:text-rose-400">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm font-medium hover:text-rose-400">
                  Telusuri
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-sm font-medium hover:text-rose-400">
                  Download
                </Link>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm font-medium hover:text-rose-400">
                    Credit
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-gray-800">
                    <DropdownMenuItem className="text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      <Link href="https://instagram.com/_mmaul_" target="_blank" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Muhamad Maulana (Web Dev)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      <Link href="https://instagram.com/azizfikri.alfalah" target="_blank" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Aziz Fikri (Mobile Dev)
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchForm />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open search menu"
              >
                <Search className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] bg-black border-gray-800 p-4">
              <SearchForm />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] bg-black border-gray-800 p-4">
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="block text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="block text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      Kategori
                    </Link>
                  </li>
                  <li>
                    <Link href="/explore" className="block text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      Telusuri
                    </Link>
                  </li>
                  <li>
                    <Link href="/downloads" className="block text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                      Download
                    </Link>
                  </li>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="block text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                        Credit
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black border-gray-800">
                        <DropdownMenuItem className="text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                          <Link href="https://instagram.com/_mmaul_" target="_blank" className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Muhamad Maulana (Web Dev)
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm font-medium text-[#00d4bd] hover:text-rose-400">
                          <Link href="https://instagram.com/azizfikri.alfalah" target="_blank" className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Aziz Fikri (Mobile Dev)
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                </ul>
              </nav>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="pb-20">
        {dramaData.featured.length > 0 && <FeaturedContent featured={dramaData.featured} />}
        <div className="space-y-8 px-4 pt-6 md:px-6">
          {dramaData.mustWatch.length > 0 && (
            <ContentRow 
              title="Drama yang Wajib Ditonton" 
              items={dramaData.mustWatch} 
              viewAllLink="/must-watch"
            />
          )}
          {dramaData.currentlyAiring.length > 0 && (
            <ContentRow 
              title="Sedang Trending" 
              items={dramaData.currentlyAiring} 
              viewAllLink="/trending"
            />
          )}
          {dramaData.interestingDramas.length > 0 && (
            <ContentRow 
              title="Drama Menarik" 
              items={dramaData.interestingDramas} 
              viewAllLink="/hidden-gems"
            />
          )}
        </div>
      </main>
    </div>
  )
}
