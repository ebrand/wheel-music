import { NextResponse } from "next/server";
import { createPublicServerClient } from "@/lib/supabase/server";
import type { Album, Track, AlbumWithTracks } from "@/types/database";

export async function GET() {
  const supabase = await createPublicServerClient();

  const { data, error } = await supabase
    .from("album")
    .select("*, tracks:track(id, album_id, title, track_number, audio_url, duration_seconds, is_published, created_at, updated_at)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const albums: AlbumWithTracks[] = ((data ?? []) as (Album & { tracks: Track[] })[]).map(
    (album) => ({
      ...album,
      tracks: album.tracks
        .filter((t) => t.is_published)
        .sort((a, b) => a.track_number - b.track_number),
    })
  );

  return NextResponse.json(albums);
}
