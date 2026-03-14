"use client";

import { BandMember } from "@/types/database";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface MemberEditorProps {
  members: BandMember[];
  onChange: (members: BandMember[]) => void;
  onDelete: (id: string) => void;
}

export function MemberEditor({
  members,
  onChange,
  onDelete,
}: MemberEditorProps) {
  function updateMember(index: number, updates: Partial<BandMember>) {
    const updated = members.map((m, i) =>
      i === index ? { ...m, ...updates } : m
    );
    onChange(updated);
  }

  function addMember() {
    onChange([
      ...members,
      {
        id: "",
        name: "",
        role: "",
        bio: null,
        image_url: null,
        url: null,
        display_order: members.length,
        created_at: "",
        updated_at: "",
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      {members.map((member, idx) => (
        <Card key={member.id || `new-${idx}`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input
                value={member.name}
                onChange={(e) => updateMember(idx, { name: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <Input
                value={member.role}
                onChange={(e) => updateMember(idx, { role: e.target.value })}
                placeholder="Guitar, Vocals, etc."
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea
              rows={2}
              value={member.bio || ""}
              onChange={(e) => updateMember(idx, { bio: e.target.value })}
              placeholder="Short bio"
            />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">Image</label>
            <Input
              value={member.image_url || ""}
              onChange={(e) =>
                updateMember(idx, { image_url: e.target.value })
              }
              placeholder="/images/members/photo.jpg"
            />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">URL</label>
            <Input
              value={member.url || ""}
              onChange={(e) =>
                updateMember(idx, { url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Display Order
              </label>
              <Input
                type="number"
                value={member.display_order}
                onChange={(e) =>
                  updateMember(idx, {
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-end">
              {member.id && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => onDelete(member.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}

      <Button variant="outline" type="button" onClick={addMember}>
        + Add Member
      </Button>
    </div>
  );
}
