"use client";

import { BandInfo } from "@/types/database";
import { Textarea } from "@/components/ui/Input";

interface ContentEditorProps {
  info: BandInfo[];
  onChange: (info: BandInfo[]) => void;
}

const INFO_FIELDS = [
  { key: "tagline", label: "Tagline", rows: 1 },
  { key: "bio", label: "Band Bio", rows: 5 },
];

export function ContentEditor({ info, onChange }: ContentEditorProps) {
  function updateValue(key: string, value: string) {
    const existing = info.find((i) => i.key === key);
    if (existing) {
      onChange(info.map((i) => (i.key === key ? { ...i, value } : i)));
    } else {
      onChange([
        ...info,
        {
          id: "",
          key,
          value,
          created_at: "",
          updated_at: "",
        },
      ]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {INFO_FIELDS.map((field) => {
        const current = info.find((i) => i.key === field.key);
        return (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}
            </label>
            <Textarea
              rows={field.rows}
              value={current?.value || ""}
              onChange={(e) => updateValue(field.key, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
