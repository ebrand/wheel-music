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

export async function GET(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const albumId = req.nextUrl.searchParams.get("album_id");
  if (!albumId) {
    return NextResponse.json({ error: "album_id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("track")
    .select("*")
    .eq("album_id", albumId)
    .order("track_number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("track")
    .insert({
      album_id: body.album_id,
      title: body.title,
      track_number: Number(body.track_number) || 1,
      audio_url: body.audio_url,
      duration_seconds: body.duration_seconds ? Number(body.duration_seconds) : null,
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
    return NextResponse.json({ error: "Track id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("track")
    .update({
      title: body.title,
      track_number: Number(body.track_number) || 1,
      audio_url: body.audio_url,
      duration_seconds: body.duration_seconds ? Number(body.duration_seconds) : null,
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
    return NextResponse.json({ error: "Track id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("track").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
