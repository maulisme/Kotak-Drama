import { DramaData } from "@/types/drama"

async function fetchDramaData() {
  try {
    const response = await fetch('https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in.json')
    const data = await response.json()
    return data.pageProps
  } catch (error) {
    console.error('Error fetching drama data:', error)
    return null
  }
}

function transformDramaData(rawData: any): DramaData {
  if (!rawData) return {
    featured: [],
    mustWatch: [],
    currentlyAiring: [],
    interestingDramas: []
  }

  // Transform bigList items to our data structure
  const transformDrama = (item: any) => ({
    id: item.originalBookId,
    title: item.name,
    genre: item.tags?.join(', ') || item.typeTwoName || '',
    poster: item.cover,
    bookNameLower: item.bookNameLower,
    videoUrl: `/watch/${item.bookNameLower}`,
    jsonUrl: `https://www.dramaboxdb.com/_next/data/dramaboxdb_prod_20250515/in/movie/${item.originalBookId}/${item.bookNameLower}.json`
  })

  const transformFeaturedDrama = (item: any): any => ({
    ...transformDrama(item),
    type: item.typeTwoName || 'Drama',
    description: item.introduction || '',
    backdrop: item.cover,
    episodes: Array.from({ length: item.chapterCount || 0 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      duration: "1 jam 10 menit",
      thumbnail: item.cover,
    })),
    cast: item.author || '',
    director: item.author || '',
  })

  // Get first 5 items from bigList as featured
  const featured = rawData.bigList?.slice(0, 5).map(transformFeaturedDrama) || []

  // Get must watch dramas from smallData
  const mustWatch = rawData.smallData
    ?.find((section: any) => section.name === "必看好剧")
    ?.items?.map(transformDrama) || []

  // Get currently airing dramas from smallData
  const currentlyAiring = rawData.smallData
    ?.find((section: any) => section.name === "当前热播")
    ?.items?.map(transformDrama) || []

  // Get interesting dramas from smallData
  const interestingDramas = rawData.smallData
    ?.find((section: any) => section.name === "精彩剧集")
    ?.items?.map(transformDrama) || []

  return {
    featured,
    mustWatch,
    currentlyAiring,
    interestingDramas,
  }
}

export async function getDramaData(): Promise<DramaData> {
  const rawData = await fetchDramaData()
  return transformDramaData(rawData)
}

interface VideoData {
  meta: {
    movieName: string;
    cover: string;
    totalEps: number;
  };
  detail: {
    chapterId: string;
    chapterName: string;
    videoUrls: Array<{
      cdn: string;
      quality: number;
      url: string;
    }>;
  };
}