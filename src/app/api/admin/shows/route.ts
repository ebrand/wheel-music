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
    .from("shows")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("shows")
    .insert({
      date: body.date,
      venue: body.venue,
      city: body.city,
      state: body.state,
      ticket_url: body.ticket_url || null,
      description: body.description || null,
      is_published: body.is_published ?? true,
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
    return NextResponse.json({ error: "Show id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("shows")
    .update({
      date: body.date,
      venue: body.venue,
      city: body.city,
      state: body.state,
      ticket_url: body.ticket_url ?? null,
      description: body.description ?? null,
      is_published: body.is_published,
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

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Show id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("shows").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
