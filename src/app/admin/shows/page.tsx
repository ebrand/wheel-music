"use client";

import { useState, useEffect, useCallback } from "react";
import { Show } from "@/types/database";
import { formatDate, formatTime } from "@/lib/utils";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { ShowForm } from "@/components/admin/ShowForm";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Show | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchShows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shows");
      if (res.ok) {
        const data = await res.json();
        setShows(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this show?")) return;
    await fetch(`/api/admin/shows?id=${id}`, { method: "DELETE" });
    fetchShows();
  }

  return (
    <AuthGuard>
      <section className="py-16">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-muted hover:text-foreground">
                &larr; Dashboard
              </Link>
              <h1 className="mt-2 text-3xl font-bold">Manage Shows</h1>
            </div>
            {!adding && !editing && (
              <Button onClick={() => setAdding(true)}>Add Show</Button>
            )}
          </div>

          {(adding || editing) && (
            <Card className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">
                {editing ? "Edit Show" : "New Show"}
              </h2>
              <ShowForm
                show={editing || undefined}
                onSave={() => {
                  setAdding(false);
                  setEditing(null);
                  fetchShows();
                }}
                onCancel={() => {
                  setAdding(false);
                  setEditing(null);
                }}
              />
            </Card>
          )}

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : shows.length === 0 ? (
            <p className="text-muted">No shows yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {shows.map((show) => (
                <Card
                  key={show.id}
                  className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-accent">
                      {formatDate(show.date)}
                      {show.show_time && ` at ${formatTime(show.show_time)}`}
                    </p>
                    <p className="font-semibold">{show.venue}</p>
                    <p className="text-sm text-muted">
                      {show.city}, {show.state}
                      {!show.is_published && (
                        <span className="ml-2 text-yellow-500">(Draft)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(show);
                        setAdding(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(show.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </AuthGuard>
  );
}
