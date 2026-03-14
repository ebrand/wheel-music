"use client";

import { useState, useCallback } from "react";
import { Show } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { VenuePicker } from "@/components/admin/VenuePicker";

interface ShowFormProps {
  show?: Show;
  onSave: () => void;
  onCancel: () => void;
}

export function ShowForm({ show, onSave, onCancel }: ShowFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [venueLat, setVenueLat] = useState(show?.venue_lat?.toString() ?? "");
  const [venueLng, setVenueLng] = useState(show?.venue_lng?.toString() ?? "");

  const handleVenueSelect = useCallback(
    (coords: { lat: number; lng: number }) => {
      setVenueLat(coords.lat.toString());
      setVenueLng(coords.lng.toString());
    },
    []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const latStr = data.get("venue_lat") as string;
    const lngStr = data.get("venue_lng") as string;

    const payload = {
      id: show?.id,
      date: data.get("date"),
      show_time: data.get("show_time") || null,
      venue: data.get("venue"),
      city: data.get("city"),
      state: data.get("state"),
      ticket_url: data.get("ticket_url") || null,
      description: data.get("description") || null,
      venue_lat: latStr ? parseFloat(latStr) : null,
      venue_lng: lngStr ? parseFloat(lngStr) : null,
      is_published: data.get("is_published") === "on",
    };

    try {
      const res = await fetch("/api/admin/shows", {
        method: show ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save show");
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>
          <Input
            name="date"
            type="date"
            required
            defaultValue={show?.date}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Time</label>
          <Input
            name="show_time"
            type="time"
            defaultValue={show?.show_time || ""}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Venue</label>
        <Input name="venue" required defaultValue={show?.venue} placeholder="Venue name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">City</label>
          <Input name="city" required defaultValue={show?.city} placeholder="City" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">State</label>
          <Input name="state" required defaultValue={show?.state} placeholder="TX" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Ticket URL</label>
        <Input
          name="ticket_url"
          type="url"
          defaultValue={show?.ticket_url || ""}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <Textarea
          name="description"
          rows={2}
          defaultValue={show?.description || ""}
          placeholder="Optional details"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Venue Lookup</label>
        <VenuePicker
          onSelect={handleVenueSelect}
          initialValue={show ? `${show.venue}, ${show.city}, ${show.state}` : undefined}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Latitude</label>
          <Input
            name="venue_lat"
            type="number"
            step="any"
            value={venueLat}
            onChange={(e) => setVenueLat(e.target.value)}
            placeholder="e.g. 30.2672"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Longitude</label>
          <Input
            name="venue_lng"
            type="number"
            step="any"
            value={venueLng}
            onChange={(e) => setVenueLng(e.target.value)}
            placeholder="e.g. -97.7431"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={show?.is_published ?? true}
          className="rounded border-border"
        />
        Published
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : show ? "Update Show" : "Add Show"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
