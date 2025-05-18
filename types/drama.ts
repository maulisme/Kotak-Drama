export interface Episode {
  number: number
  title: string
  duration: string
  thumbnail: string
}

export interface Drama {
  id: string
  title: string
  year: number
  genre: string
  poster: string
  bookNameLower?: string
  videoUrl: string
  jsonUrl?: string
}

export interface FeaturedDrama extends Drama {
  type: string
  description: string
  backdrop: string
  episodes: Episode[]
  cast: string
  director: string
}

export interface DramaData {
  featured: FeaturedDrama[]
  mustWatch: Drama[]
  currentlyAiring: Drama[]
  interestingDramas: Drama[]
} 