"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Heart, Share2, Download, Facebook, Twitter, MessageCircle, Instagram } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EpisodeList } from "@/components/episode-list"
import { VideoPlayer } from "@/components/video-player"
import { DramaCard } from "@/components/drama-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MovieData {
  pageProps: {
    bookInfo: {
      bookId: string
      bookName: string
      cover: string
      viewCount: number
      followCount: number
      introduction: string
      chapterCount: number
      labels: string[]
      tags: string[]
      typeTwoList: Array<{
        id: number
        name: string
        replaceName: string
      }>
      language: string
      typeTwoName: string
      bookNameEn: string
      bookNameLower: string
    }
    recommends: Array<{
      bookId: string
      bookName: string
      cover: string
      viewCount: number
      followCount: number
      introduction: string
      chapterCount: number
      labels: string[]
      tags: string[]
      typeTwoList: Array<{
        id: number
        name: string
        replaceName: string
      }>
      language: string
      typeTwoName: string
      bookNameEn: string
      bookNameLower: string
    }>
  }
}

export default function WatchPage() {
  const params = useParams()
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Get movie data from localStorage
    const storedData = localStorage.getItem('movieData')
    if (storedData) {
      setMovieData(JSON.parse(storedData))
    }
  }, [])

  if (!movieData) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>
  }

  const { bookInfo } = movieData.pageProps

  const handleEpisodeSelect = (episode: number) => {
    setCurrentEpisode(episode)
  }

  const handleDownload = async () => {
    if (!movieData) return

    try {
      setIsDownloading(true)
      const response = await fetch(`https://n0bu.my.id/api/dramabox.php?id=${bookInfo.bookId}&eps=${currentEpisode}`)
      const data = await response.json()
      
      if (data.data?.detail?.videoUrls) {
        // Find the video URL with nakavideo CDN and 720p quality
        const videoUrl = data.data.detail.videoUrls.find(
          (url: any) => url.cdn === "nakavideo.dramaboxdb.com" && url.quality === 720
        )?.url

        if (videoUrl) {
          // Fetch the video as a blob
          const videoResponse = await fetch(videoUrl)
          const videoBlob = await videoResponse.blob()
          
          // Create a blob URL
          const blobUrl = window.URL.createObjectURL(videoBlob)
          
          // Create a temporary link element
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `${bookInfo.bookName} - Episode ${currentEpisode}.mp4`
          link.style.display = 'none'
          
          // Append to body, click, and cleanup
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(blobUrl)
        }
      }
    } catch (error) {
      console.error('Error downloading video:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = (platform: string) => {
    if (!movieData) return

    const { bookInfo } = movieData.pageProps
    const shareUrl = window.location.href
    const shareText = `Watch ${bookInfo.bookName} Episode ${currentEpisode} on DramaBox`
    
    let shareLink = ''
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        break
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        // We'll copy the link to clipboard instead
        navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard! You can now share it on Instagram.')
        return
      case 'tiktok':
        // TikTok doesn't support direct sharing via URL
        // We'll copy the link to clipboard instead
        navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard! You can now share it on TikTok.')
        return
    }

    // Open share link in a new window
    window.open(shareLink, '_blank', 'width=600,height=400')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-black/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-medium">{bookInfo.bookName}</h1>
        </div>
      </header>
      <main className="pb-20">
        <VideoPlayer 
          videoUrl={`/watch/${bookInfo.bookNameLower}`} 
          currentEpisode={currentEpisode}
        />

        <div className="px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{bookInfo.bookName}</h1>
              <p className="text-sm text-gray-400">
                Episode {currentEpisode} • {bookInfo.typeTwoName} • {bookInfo.language}
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-gray-900 border-gray-800">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleShare('instagram')}
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleShare('tiktok')}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span>TikTok</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className={`h-5 w-5 ${isDownloading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="episodes" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="episodes">Episode</TabsTrigger>
              <TabsTrigger value="details">Detail</TabsTrigger>
              <TabsTrigger value="similar">Serupa</TabsTrigger>
            </TabsList>
            <TabsContent value="episodes" className="mt-4">
              <EpisodeList
                episodes={Array.from({ length: bookInfo.chapterCount }, (_, i) => ({
                  number: i + 1,
                  title: `Episode ${i + 1}`,
                  duration: "24:00",
                  thumbnail: bookInfo.cover
                }))}
                currentEpisode={currentEpisode}
                onSelectEpisode={handleEpisodeSelect}
              />
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <p>{bookInfo.introduction}</p>
                <div>
                  <h3 className="font-medium">Labels:</h3>
                  <p className="text-gray-400">{bookInfo.labels.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-medium">Type:</h3>
                  <p className="text-gray-400">{bookInfo.typeTwoName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Views:</h3>
                  <p className="text-gray-400">{bookInfo.viewCount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Followers:</h3>
                  <p className="text-gray-400">{bookInfo.followCount.toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="similar" className="mt-4">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {movieData.pageProps.recommends.map((item) => ({
                  id: item.bookId,
                  title: item.bookName,
                  genre: item.typeTwoName || '',
                  poster: item.cover,
                  bookNameLower: item.bookNameLower,
                  videoUrl: `/watch/${item.bookNameLower}`,
                  jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.bookId}/${item.bookNameLower}.json`
                })).map((drama) => (
                  <div key={drama.id} className="scale-90">
                    <DramaCard drama={drama} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
