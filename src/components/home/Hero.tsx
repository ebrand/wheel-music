import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero({ tagline }: { tagline?: string }) {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">WHEEL</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
          {tagline || "Tenacious power pop from Austin, Texas."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/shows"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            See Shows
          </Link>
          <Link
            href="/music"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card"
          >
            Listen
          </Link>
        </div>
      </Container>
    </section>
  );
}
