import { Show } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export function ShowCard({ show }: { show: Show }) {
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasMap = show.venue_lat != null && show.venue_lng != null && mapKey;

  return (
    <Card className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-accent">{formatDate(show.date)}</p>
        <p className="text-lg font-semibold">{show.venue}</p>
        <p className="text-sm text-muted">
          {show.city}, {show.state}
        </p>
        {show.description && (
          <p className="mt-1 text-sm text-muted">{show.description}</p>
        )}
        {show.ticket_url && (
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Tickets
          </a>
        )}
      </div>
      {hasMap && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${show.venue}, ${show.city}, ${show.state}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${show.venue_lat},${show.venue_lng}&zoom=15&size=200x200&markers=${show.venue_lat},${show.venue_lng}&key=${mapKey}`}
            alt={`Map of ${show.venue}`}
            width={200}
            height={200}
            className="shrink-0 rounded-md"
          />
        </a>
      )}
    </Card>
  );
}
