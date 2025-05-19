"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { getDramaId } from "@/lib/drama-data"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  videoUrl: string;
  currentEpisode?: number;
}

export function VideoPlayer({ videoUrl, currentEpisode = 1 }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [videoSrc, setVideoSrc] = useState<string>("")
  const [thumbnail, setThumbnail] = useState("/placeholder.svg")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset video state when episode changes
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setVideoSrc("")

    // Get movie data from localStorage
    const storedData = localStorage.getItem('movieData')
    if (storedData) {
      const movieData = JSON.parse(storedData)
      setThumbnail(movieData.pageProps.bookInfo.cover)
      
      // Fetch video data from dramabox API
      const fetchVideoData = async () => {
        try {
          const response = await fetch(`https://n0bu.my.id/api/dramabox.php?id=${getDramaId(movieData.pageProps.bookInfo)}&eps=${currentEpisode}`)
          const data = await response.json()
          
          if (data.data?.detail?.videoUrls) {
            // Find the video URL with nakavideo CDN and 720p quality
            const videoUrl = data.data.detail.videoUrls.find(
              (url: any) => url.cdn === "nakavideo.dramaboxdb.com" && url.quality === 720
            )?.url
            
            if (videoUrl) {
              setVideoSrc(videoUrl)
            }
          }
        } catch (error) {
          console.error('Error fetching video data:', error)
        }
      }
      
      fetchVideoData()
    }
  }, [currentEpisode])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0]
      setVolume(value[0])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative aspect-video max-w-4xl mx-auto">
      {!videoSrc ? (
        <div className="relative h-full w-full">
          <div data-book-id={videoUrl} className="hidden" />
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handlePlayPause}
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoSrc}
          className="h-full w-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-white">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>

          <div className="w-24">
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
