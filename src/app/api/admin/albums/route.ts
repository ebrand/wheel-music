import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/stytch/auth";
import { createAdminClient } from "@/lib/supabase/server";

async function guard() {
  const { authenticated } = await validateAdminSession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("album")
    .select("*, tracks:track(id, album_id, title, track_number, audio_url, duration_seconds, is_published, created_at, updated_at)")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const albums = (data ?? []).map((album: Record<string, unknown> & { tracks: Record<string, unknown>[] }) => ({
    ...album,
    tracks: (album.tracks ?? []).sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        (a.track_number as number) - (b.track_number as number)
    ),
  }));

  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("album")
    .insert({
      title: body.title,
      artist: body.artist || "Wheel",
      cover_image_url: body.cover_image_url || null,
      year: body.year ? Number(body.year) : null,
      sort_order: body.sort_order ?? 0,
      is_published: body.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Album id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("album")
    .update({
      title: body.title,
      artist: body.artist || "Wheel",
      cover_image_url: body.cover_image_url ?? null,
      year: body.year ? Number(body.year) : null,
      sort_order: body.sort_order ?? 0,
      is_published: body.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Album id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("album").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
