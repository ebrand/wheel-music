"use client";

import { useState } from "react";
import { Show } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface ShowFormProps {
  show?: Show;
  onSave: () => void;
  onCancel: () => void;
}

export function ShowForm({ show, onSave, onCancel }: ShowFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      id: show?.id,
      date: data.get("date"),
      venue: data.get("venue"),
      city: data.get("city"),
      state: data.get("state"),
      ticket_url: data.get("ticket_url") || null,
      description: data.get("description") || null,
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
          <label className="mb-1 block text-sm font-medium">Venue</label>
          <Input name="venue" required defaultValue={show?.venue} placeholder="Venue name" />
        </div>
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
