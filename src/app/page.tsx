import { createPublicServerClient } from "@/lib/supabase/server";
import { Show, BandInfo } from "@/types/database";
import { Hero } from "@/components/home/Hero";
import { UpcomingShows } from "@/components/home/UpcomingShows";

export default async function HomePage() {
  const supabase = await createPublicServerClient();

  const today = new Date().toISOString().split("T")[0];

  const [showsResult, taglineResult] = await Promise.all([
    supabase
      .from("shows")
      .select("*")
      .eq("is_published", true)
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(3),
    supabase.from("band_info").select("*").eq("key", "tagline").single(),
  ]);

  const shows = (showsResult.data as Show[]) || [];
  const tagline = (taglineResult.data as BandInfo | null)?.value;

  return (
    <>
      <Hero tagline={tagline} />
      <UpcomingShows shows={shows} />
    </>
  );
}
