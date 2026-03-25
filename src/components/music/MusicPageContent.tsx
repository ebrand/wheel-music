"use client";

import { useState } from "react";
import type { AlbumWithTracks, Track, Album } from "@/types/database";
import { AudioPlayerProvider, useAudioPlayer } from "./AudioPlayerContext";
import AudioPlayer from "./AudioPlayer";

function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AlbumCard({ album }: { album: AlbumWithTracks }) {
  const [expanded, setExpanded] = useState(false);
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-border/20"
      >
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={album.title}
            className="h-20 w-20 flex-shrink-0 rounded border border-border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded border border-border bg-background">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">{album.title}</h2>
          <p className="text-sm text-muted">{album.artist}</p>
          <p className="text-xs text-muted">
            {album.year && `${album.year} · `}
            {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-5 w-5 flex-shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {album.tracks.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No tracks available.</p>
          ) : (
            <ul>
              {album.tracks.map((track) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <li
                    key={track.id}
                    className={`flex items-center gap-3 border-b border-border/50 px-4 py-3 last:border-b-0 transition-colors hover:bg-border/10 ${
                      isActive ? "bg-border/20" : ""
                    }`}
                  >
                    <button
                      onClick={() => playTrack(track as Track, album as Album)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                      aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      {isActive && isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <span className="w-6 text-right text-xs tabular-nums text-muted">
                      {track.track_number}
                    </span>
                    <span className={`flex-1 text-sm ${isActive ? "font-medium text-accent" : "text-foreground"}`}>
                      {track.title}
                    </span>
                    <span className="text-xs tabular-nums text-muted">
                      {formatDuration(track.duration_seconds)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function MusicPageContent({ albums }: { albums: AlbumWithTracks[] }) {
  const allTracks = albums.flatMap((a) => a.tracks);

  return (
    <AudioPlayerProvider allTracks={allTracks}>
      <div className="space-y-4 pb-24">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
      <AudioPlayer />
    </AudioPlayerProvider>
  );
}
