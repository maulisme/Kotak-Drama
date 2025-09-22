"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getDramaId } from "@/lib/drama-data";

interface VideoPlayerProps {
  videoUrl?: string;
  currentEpisode?: number;
}

type VideoUrl = { url: string; cdn?: string; quality?: number | string };

export function VideoPlayer({ videoUrl = "", currentEpisode = 1 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("/placeholder.svg");

  const resolveBookId = (): string | null => {
    try {
      const stored = localStorage.getItem("movieData");
      const md = stored ? JSON.parse(stored) : null;
      const pp = md?.pageProps ?? {};

      const bookInfo =
        pp?.bookInfo ??
        pp?.movie ??
        pp?.detail?.bookInfo ??
        pp?.detail?.movie ??
        null;

      let fromGetDramaId: string | undefined;
      if (bookInfo) {
        try {
          fromGetDramaId = getDramaId(bookInfo) as unknown as string | undefined;
        } catch {}
        if (bookInfo?.cover) setThumbnail(bookInfo.cover);
      }

      const cands: Array<string | undefined> = [
        fromGetDramaId,
        bookInfo?.bookId,
        (bookInfo as any)?.id,
        pp?.bookId,
        (pp as any)?.id,
        String(videoUrl).match(/\b(\d{6,})\b/)?.[1],
        typeof window !== "undefined"
          ? window.location.pathname.match(/\/movie\/(\d{6,})/i)?.[1]
          : undefined,
      ];

      const chosen = cands.find(Boolean) ?? null;

      console.debug("[VideoPlayer] ID candidates:", {
        chosen,
        fromGetDramaId,
        bookInfoId: bookInfo?.bookId,
        bookInfoGenericId: (bookInfo as any)?.id,
        pagePropsBookId: pp?.bookId,
        pagePropsId: (pp as any)?.id,
        videoUrl,
        pathname: typeof window !== "undefined" ? window.location.pathname : "(ssr)",
      });

      return chosen;
    } catch (e) {
      console.warn("[VideoPlayer] resolveBookId failed:", e);
      return null;
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoSrc("");

    const controller = new AbortController();

    const fetchVideoData = async () => {
      const bookId = resolveBookId();
      if (!bookId) {
        console.error("[VideoPlayer] bookId tidak ditemukan.");
        return;
      }

      const url = `/api/stream?bookid=${encodeURIComponent(bookId)}&episode=${encodeURIComponent(
        String(currentEpisode)
      )}`;
      console.debug("[VideoPlayer] fetch stream:", url);

      try {
        const res = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!res.ok) {
          console.error("Stream fetch failed:", res.status, res.statusText);
          return;
        }

        const json = await res.json();
        const urls: VideoUrl[] = json?.data?.detail?.videoUrls ?? [];

        const best =
          urls.find(
            (u) =>
              u?.cdn === "nakavideo.dramaboxdb.com" &&
              Number(u?.quality) === 1080 &&
              typeof u?.url === "string"
          )?.url ?? urls[0]?.url;

        if (best) setVideoSrc(best);
        else console.warn("[VideoPlayer] Tidak ada URL video playable.");
      } catch (err: any) {
        if (err?.name !== "AbortError") console.error("Error fetching video data:", err);
      }
    };

    fetchVideoData();
    return () => controller.abort();
  }, [currentEpisode, videoUrl]);

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  };
  const handleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const handleVolumeChange = (value: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = value[0];
    v.volume = vol;
    setVolume(vol);
  };
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime || 0);
    setDuration(v.duration || 0);
  };
  const handleSeek = (value: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!isFullscreen) v.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  };
  const formatTime = (t: number) => {
    const time = isFinite(t) ? t : 0;
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="relative aspect-video max-w-4xl mx-auto">
      {!videoSrc ? (
        <div className="relative h-full w-full">
          <img src={thumbnail} alt="Video thumbnail" className="h-full w-full object-cover" />
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
          controls={false}
          // crossOrigin="anonymous" // aktifkan bila perlu
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <div className="flex-1">
            <Slider value={[currentTime]} max={Math.max(duration, 0)} step={1} onValueChange={handleSeek} className="w-full" />
          </div>

          <div className="flex items-center gap-2 text-sm text-white">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>

          <div className="w-24">
            <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-full" />
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
