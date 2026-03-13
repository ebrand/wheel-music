import { createPublicServerClient } from "@/lib/supabase/server";
import { Show } from "@/types/database";
import { isUpcoming } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ShowCard } from "@/components/shows/ShowCard";

export const metadata = { title: "Shows | Wheel" };

export default async function ShowsPage() {
  const supabase = await createPublicServerClient();

  const { data } = await supabase
    .from("shows")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: true });

  const shows = (data as Show[]) || [];
  const upcoming = shows.filter((s) => isUpcoming(s.date));
  const past = shows.filter((s) => !isUpcoming(s.date)).reverse();

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-4xl font-bold">Shows</h1>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-muted">No upcoming shows right now. Check back soon.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {upcoming.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold text-muted">Past Shows</h2>
            <div className="flex flex-col gap-4 opacity-60">
              {past.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
