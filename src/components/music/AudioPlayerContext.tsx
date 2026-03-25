"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import type { Track, Album } from "@/types/database";

interface AudioPlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track, album: Album) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrev: () => void;
  tracks: Track[];
}

const AudioPlayerContext = createContext<AudioPlayerState | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

export function AudioPlayerProvider({
  children,
  allTracks,
}: {
  children: React.ReactNode;
  allTracks: Track[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const playTrack = useCallback(
    (track: Track, album: Album) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentTrack?.id === track.id) {
        if (audio.paused) {
          audio.play();
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      audio.src = track.audio_url;
      audio.play();
      setCurrentTrack(track);
      setCurrentAlbum(album);
      setIsPlaying(true);
      setProgress(0);
    },
    [currentTrack?.id]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const playNext = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    const albumTracks = allTracks.filter((t) => t.album_id === currentTrack.album_id);
    const idx = albumTracks.findIndex((t) => t.id === currentTrack.id);
    if (idx < albumTracks.length - 1) {
      playTrack(albumTracks[idx + 1], currentAlbum);
    }
  }, [currentTrack, currentAlbum, allTracks, playTrack]);

  const playPrev = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    const albumTracks = allTracks.filter((t) => t.album_id === currentTrack.album_id);
    const idx = albumTracks.findIndex((t) => t.id === currentTrack.id);
    if (idx > 0) {
      playTrack(albumTracks[idx - 1], currentAlbum);
    }
  }, [currentTrack, currentAlbum, allTracks, playTrack]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        currentAlbum,
        isPlaying,
        progress,
        duration,
        playTrack,
        pause,
        resume,
        seek,
        playNext,
        playPrev,
        tracks: allTracks,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
