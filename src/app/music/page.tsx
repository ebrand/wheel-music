import { createPublicServerClient } from "@/lib/supabase/server";
import type { Album, Track, AlbumWithTracks } from "@/types/database";
import { Container } from "@/components/ui/Container";
import MusicPageContent from "@/components/music/MusicPageContent";

export const metadata = { title: "Music | Wheel" };

export default async function MusicPage() {
  const supabase = await createPublicServerClient();

  const { data } = await supabase
    .from("album")
    .select("*, tracks:track(id, album_id, title, track_number, audio_url, duration_seconds, is_published, created_at, updated_at)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  const albums: AlbumWithTracks[] = ((data ?? []) as (Album & { tracks: Track[] })[]).map(
    (album) => ({
      ...album,
      tracks: album.tracks
        .filter((t) => t.is_published)
        .sort((a, b) => a.track_number - b.track_number),
    })
  );

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-4xl font-bold">Music</h1>
        <p className="mt-4 text-muted">Browse and listen to Wheel&apos;s discography.</p>

        <div className="mt-10">
          {albums.length === 0 ? (
            <p className="text-muted">No music yet. Check back soon.</p>
          ) : (
            <MusicPageContent albums={albums} />
          )}
        </div>

        <div className="mt-12">
          <a
            href="https://music.apple.com/us/artist/wheel/1518252109"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/wheel-on-apple.png"
              alt="Listen on Apple Music"
              className="h-auto w-full max-w-sm rounded-lg"
            />
          </a>
        </div>
      </Container>
    </section>
  );
}
