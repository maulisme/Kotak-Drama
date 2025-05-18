"use client"

interface Episode {
  number: number
  title: string
  duration: string
  thumbnail: string
}

interface EpisodeListProps {
  episodes: Episode[]
  currentEpisode: number
  onSelectEpisode: (episode: number) => void
}

export function EpisodeList({ episodes, currentEpisode, onSelectEpisode }: EpisodeListProps) {
  // If no episodes provided, create dummy episodes
  const episodeList =
    episodes.length > 0
      ? episodes
      : Array.from({ length: 16 }, (_, i) => ({
          number: i + 1,
        }))

  return (
    <div className="grid grid-cols-7 gap-2">
      {episodeList.map((episode) => (
        <button
          key={episode.number}
          className={`flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors ${
            currentEpisode === episode.number
              ? "bg-[#00d4bd] text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => onSelectEpisode(episode.number)}
        >
          {episode.number}
        </button>
      ))}
    </div>
  )
}
