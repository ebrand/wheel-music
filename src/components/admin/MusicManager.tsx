"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Album, Track, AlbumWithTracks } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicManager({ initialAlbums }: { initialAlbums: AlbumWithTracks[] }) {
  const [albums, setAlbums] = useState<AlbumWithTracks[]>(initialAlbums);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("Wheel");
  const [year, setYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [albumLoading, setAlbumLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const [managingAlbumId, setManagingAlbumId] = useState<string | null>(null);
  const [addingTrack, setAddingTrack] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [trackAudioUrl, setTrackAudioUrl] = useState("");
  const [trackDuration, setTrackDuration] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  const router = useRouter();

  // ── Album handlers ──

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload-cover", { method: "POST", body });
    if (res.ok) {
      const { url } = await res.json();
      setCoverUrl(url);
    }
    setCoverUploading(false);
    e.target.value = "";
  };

  const handleAddAlbum = async () => {
    setAlbumLoading(true);
    const res = await fetch("/api/admin/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        artist,
        year: year ? Number(year) : null,
        cover_image_url: coverUrl || null,
        sort_order: Number(sortOrder) || 0,
      }),
    });
    if (res.ok) {
      const newAlbum = await res.json();
      setAlbums((prev) => [...prev, { ...newAlbum, tracks: [] }]);
      resetAlbumForm();
      router.refresh();
    }
    setAlbumLoading(false);
  };

  const handleEditAlbum = async () => {
    if (!editingId) return;
    setAlbumLoading(true);
    const res = await fetch("/api/admin/albums", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        title,
        artist,
        year: year ? Number(year) : null,
        cover_image_url: coverUrl || null,
        sort_order: Number(sortOrder) || 0,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setAlbums((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...updated, tracks: a.tracks } : a))
      );
      resetAlbumForm();
      router.refresh();
    }
    setAlbumLoading(false);
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Delete this album and all its tracks?")) return;
    const res = await fetch("/api/admin/albums", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      if (managingAlbumId === id) setManagingAlbumId(null);
      router.refresh();
    }
  };

  const startEditAlbum = (album: Album) => {
    setEditingId(album.id);
    setAdding(false);
    setTitle(album.title);
    setArtist(album.artist);
    setYear(album.year?.toString() ?? "");
    setCoverUrl(album.cover_image_url ?? "");
    setSortOrder(album.sort_order.toString());
  };

  const resetAlbumForm = () => {
    setAdding(false);
    setEditingId(null);
    setTitle("");
    setArtist("Wheel");
    setYear("");
    setCoverUrl("");
    setSortOrder("0");
  };

  // ── Track handlers ──

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload-audio", { method: "POST", body });
    if (res.ok) {
      const { url } = await res.json();
      setTrackAudioUrl(url);
    }
    setAudioUploading(false);
    e.target.value = "";
  };

  const handleAddTrack = async () => {
    if (!managingAlbumId) return;
    setTrackLoading(true);
    const res = await fetch("/api/admin/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        album_id: managingAlbumId,
        title: trackTitle,
        track_number: Number(trackNumber) || 1,
        audio_url: trackAudioUrl,
        duration_seconds: trackDuration ? Number(trackDuration) : null,
      }),
    });
    if (res.ok) {
      const newTrack = await res.json();
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === managingAlbumId
            ? { ...a, tracks: [...a.tracks, newTrack].sort((x, y) => x.track_number - y.track_number) }
            : a
        )
      );
      resetTrackForm();
      router.refresh();
    }
    setTrackLoading(false);
  };

  const handleEditTrack = async () => {
    if (!editingTrackId || !managingAlbumId) return;
    setTrackLoading(true);
    const res = await fetch("/api/admin/tracks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingTrackId,
        title: trackTitle,
        track_number: Number(trackNumber) || 1,
        audio_url: trackAudioUrl,
        duration_seconds: trackDuration ? Number(trackDuration) : null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === managingAlbumId
            ? {
                ...a,
                tracks: a.tracks
                  .map((t) => (t.id === updated.id ? updated : t))
                  .sort((x, y) => x.track_number - y.track_number),
              }
            : a
        )
      );
      resetTrackForm();
      router.refresh();
    }
    setTrackLoading(false);
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm("Delete this track?")) return;
    const res = await fetch("/api/admin/tracks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trackId }),
    });
    if (res.ok) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === managingAlbumId
            ? { ...a, tracks: a.tracks.filter((t) => t.id !== trackId) }
            : a
        )
      );
      router.refresh();
    }
  };

  const startEditTrack = (track: Track) => {
    setEditingTrackId(track.id);
    setAddingTrack(false);
    setTrackTitle(track.title);
    setTrackNumber(track.track_number.toString());
    setTrackAudioUrl(track.audio_url);
    setTrackDuration(track.duration_seconds?.toString() ?? "");
  };

  const resetTrackForm = () => {
    setAddingTrack(false);
    setEditingTrackId(null);
    setTrackTitle("");
    setTrackNumber("");
    setTrackAudioUrl("");
    setTrackDuration("");
  };

  const showAlbumForm = adding || editingId !== null;
  const showTrackForm = addingTrack || editingTrackId !== null;
  const managedAlbum = albums.find((a) => a.id === managingAlbumId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        {managingAlbumId ? (
          <Button
            variant="outline"
            onClick={() => {
              setManagingAlbumId(null);
              resetTrackForm();
            }}
          >
            &larr; Albums
          </Button>
        ) : (
          !showAlbumForm && (
            <Button
              onClick={() => {
                setAdding(true);
                resetAlbumForm();
                setAdding(true);
              }}
            >
              Add Album
            </Button>
          )
        )}
      </div>

      {/* Album form */}
      {showAlbumForm && !managingAlbumId && (
        <Card className="mb-8">
          <h3 className="mb-4 text-sm font-semibold text-muted">
            {adding ? "New Album" : "Edit Album"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Artist</label>
              <Input value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-muted">Year</label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Sort Order</label>
                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Cover Art</label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="URL or upload"
                />
                <label className="flex shrink-0 cursor-pointer items-center rounded-md border border-border px-3 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground">
                  {coverUploading ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={coverUploading}
                    className="hidden"
                  />
                </label>
              </div>
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="mt-2 h-24 w-auto rounded border border-border object-cover"
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={adding ? handleAddAlbum : handleEditAlbum} disabled={albumLoading || !title}>
              {albumLoading ? "Saving..." : adding ? "Add" : "Save"}
            </Button>
            <Button variant="outline" onClick={resetAlbumForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Track management view */}
      {managingAlbumId && managedAlbum && (
        <div>
          <div className="mb-6 flex items-center gap-4">
            {managedAlbum.cover_image_url && (
              <img
                src={managedAlbum.cover_image_url}
                alt={managedAlbum.title}
                className="h-16 w-16 rounded border border-border object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{managedAlbum.title}</h3>
              <p className="text-sm text-muted">
                {managedAlbum.artist}
                {managedAlbum.year && ` · ${managedAlbum.year}`}
                {` · ${managedAlbum.tracks.length} track${managedAlbum.tracks.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            {!showTrackForm && (
              <Button
                onClick={() => {
                  setAddingTrack(true);
                  setEditingTrackId(null);
                  const maxNum = managedAlbum.tracks.reduce((max, t) => Math.max(max, t.track_number), 0);
                  setTrackNumber((maxNum + 1).toString());
                }}
              >
                Add Track
              </Button>
            )}
          </div>

          {/* Track form */}
          {showTrackForm && (
            <Card className="mb-6">
              <h3 className="mb-4 text-sm font-semibold text-muted">
                {addingTrack ? "New Track" : "Edit Track"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs text-muted">Title</label>
                    <Input value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} placeholder="Track title" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Track #</label>
                    <Input type="number" value={trackNumber} onChange={(e) => setTrackNumber(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Audio File</label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={trackAudioUrl}
                      onChange={(e) => setTrackAudioUrl(e.target.value)}
                      placeholder="URL or upload"
                    />
                    <label className="flex shrink-0 cursor-pointer items-center rounded-md border border-border px-3 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground">
                      {audioUploading ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        disabled={audioUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Duration (seconds)</label>
                  <Input
                    type="number"
                    value={trackDuration}
                    onChange={(e) => setTrackDuration(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={addingTrack ? handleAddTrack : handleEditTrack}
                  disabled={trackLoading || !trackTitle || !trackAudioUrl}
                >
                  {trackLoading ? "Saving..." : addingTrack ? "Add" : "Save"}
                </Button>
                <Button variant="outline" onClick={resetTrackForm}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Track list */}
          {managedAlbum.tracks.length === 0 ? (
            <p className="text-sm text-muted">No tracks yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="px-4 py-3 text-xs font-semibold text-muted">#</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted">Duration</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedAlbum.tracks.map((track) => (
                    <tr key={track.id} className="border-b border-border/50 last:border-b-0">
                      <td className="px-4 py-3 text-muted">{track.track_number}</td>
                      <td className="px-4 py-3">{track.title}</td>
                      <td className="px-4 py-3 text-muted">{formatDuration(track.duration_seconds)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEditTrack(track)}
                            className="text-xs text-accent hover:text-accent-hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTrack(track.id)}
                            className="text-xs text-muted hover:text-foreground"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Albums list */}
      {!managingAlbumId && !showAlbumForm && (
        albums.length === 0 ? (
          <p className="text-sm text-muted">No albums yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Card key={album.id} className="flex flex-col gap-3">
                {album.cover_image_url && (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="w-full rounded border border-border object-cover aspect-square"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{album.title}</h3>
                  <p className="text-xs text-muted">
                    {album.artist}
                    {album.year && ` · ${album.year}`}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => {
                      setManagingAlbumId(album.id);
                      resetTrackForm();
                    }}
                    className="text-accent hover:text-accent-hover"
                  >
                    Tracks
                  </button>
                  <button
                    onClick={() => startEditAlbum(album)}
                    className="text-muted hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="text-muted hover:text-foreground"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
