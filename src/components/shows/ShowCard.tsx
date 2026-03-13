import { Show } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export function ShowCard({ show }: { show: Show }) {
  return (
    <Card className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-medium text-accent">{formatDate(show.date)}</p>
        <p className="text-lg font-semibold">{show.venue}</p>
        <p className="text-sm text-muted">
          {show.city}, {show.state}
        </p>
        {show.description && (
          <p className="mt-1 text-sm text-muted">{show.description}</p>
        )}
      </div>
      {show.ticket_url && (
        <a
          href={show.ticket_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Tickets
        </a>
      )}
    </Card>
  );
}
