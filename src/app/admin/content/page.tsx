"use client";

import { useState, useEffect, useCallback } from "react";
import { BandInfo, BandMember } from "@/types/database";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { MemberEditor } from "@/components/admin/MemberEditor";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminContentPage() {
  const [info, setInfo] = useState<BandInfo[]>([]);
  const [members, setMembers] = useState<BandMember[]>([]);
  const [deleteMemberIds, setDeleteMemberIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setInfo(data.info);
        setMembers(data.members);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  function handleDeleteMember(id: string) {
    if (!confirm("Remove this member?")) return;
    setDeleteMemberIds((prev) => [...prev, id]);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          info: info.map((i) => ({ key: i.key, value: i.value })),
          members,
          deleteMemberIds,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save");
      }

      setMessage("Saved!");
      setDeleteMemberIds([]);
      fetchContent();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <section className="py-16">
        <Container>
          <div className="mb-6">
            <Link
              href="/admin"
              className="text-sm text-muted hover:text-foreground"
            >
              &larr; Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold">Manage Content</h1>
          </div>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">Band Info</h2>
                <ContentEditor info={info} onChange={setInfo} />
              </div>

              <div className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">Band Members</h2>
                <MemberEditor
                  members={members}
                  onChange={setMembers}
                  onDelete={handleDeleteMember}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save All Changes"}
                </Button>
                {message && (
                  <p className="text-sm text-muted">{message}</p>
                )}
              </div>
            </>
          )}
        </Container>
      </section>
    </AuthGuard>
  );
}
