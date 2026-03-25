"use client";

import { useState, useEffect, useCallback } from "react";
import type { AlbumWithTracks } from "@/types/database";
import { AuthGuard } from "@/components/admin/AuthGuard";
import MusicManager from "@/components/admin/MusicManager";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function AdminMusicPage() {
  const [albums, setAlbums] = useState<AlbumWithTracks[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/albums");
      if (res.ok) {
        setAlbums(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <AuthGuard>
      <section className="py-16">
        <Container>
          <div className="mb-8">
            <Link href="/admin" className="text-sm text-muted hover:text-foreground">
              &larr; Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Manage Music</h1>
          </div>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <MusicManager initialAlbums={albums} />
          )}
        </Container>
      </section>
    </AuthGuard>
  );
}
