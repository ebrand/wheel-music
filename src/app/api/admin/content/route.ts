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

  const [infoResult, membersResult] = await Promise.all([
    supabase.from("band_info").select("*").order("key"),
    supabase
      .from("band_members")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  return NextResponse.json({
    info: infoResult.data || [],
    members: membersResult.data || [],
  });
}

export async function PUT(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json();
  const supabase = createAdminClient();

  // Update band_info entries
  if (body.info) {
    for (const item of body.info) {
      await supabase
        .from("band_info")
        .upsert(
          {
            key: item.key,
            value: item.value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );
    }
  }

  // Update band_members
  if (body.members) {
    for (const member of body.members) {
      if (member.id) {
        await supabase
          .from("band_members")
          .update({
            name: member.name,
            role: member.role,
            bio: member.bio || null,
            image_url: member.image_url || null,
            url: member.url || null,
            display_order: member.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", member.id);
      } else {
        await supabase.from("band_members").insert({
          name: member.name,
          role: member.role,
          bio: member.bio || null,
          image_url: member.image_url || null,
          url: member.url || null,
          display_order: member.display_order ?? 0,
        });
      }
    }
  }

  // Delete members
  if (body.deleteMemberIds) {
    for (const id of body.deleteMemberIds) {
      await supabase.from("band_members").delete().eq("id", id);
    }
  }

  return NextResponse.json({ success: true });
}
