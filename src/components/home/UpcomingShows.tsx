import Link from "next/link";
import { Show } from "@/types/database";
import { ShowCard } from "@/components/shows/ShowCard";
import { Container } from "@/components/ui/Container";

export function UpcomingShows({ shows }: { shows: Show[] }) {
  if (shows.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upcoming Shows</h2>
          <Link
            href="/shows"
            className="text-sm text-accent hover:text-accent-hover"
          >
            View All
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </Container>
    </section>
  );
}
