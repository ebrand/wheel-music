"use client";

import { useAudioPlayer } from "./AudioPlayerContext";

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const { currentTrack, currentAlbum, isPlaying, progress, duration, pause, resume, seek, playNext, playPrev } =
    useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        {/* Track info */}
        <div className="min-w-0 w-40 flex-shrink-0">
          <p className="truncate text-sm font-medium text-foreground">{currentTrack.title}</p>
          <p className="truncate text-xs text-muted">{currentAlbum?.title}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={playPrev}
            className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-foreground"
            aria-label="Previous track"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          <button
            onClick={isPlaying ? pause : resume}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={playNext}
            className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-foreground"
            aria-label="Next track"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex flex-1 items-center gap-2">
          <span className="text-xs tabular-nums text-muted">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
          />
          <span className="text-xs tabular-nums text-muted">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
