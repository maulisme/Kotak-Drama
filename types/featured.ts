export interface Featured {
  id: string
  title: string
  description: string
  type: string
  genre: string
  poster: string
  episodes?: Episode[]
  bookNameLower?: string
  videoUrl: string
  jsonUrl?: string
}

export interface Episode {
  number: number
  title: string
  duration: string
  thumbnail: string
} 