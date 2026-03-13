import { Container } from "@/components/ui/Container";

export const metadata = { title: "Music | Wheel" };

const embeds = [
  {
    title: "Apple Music",
    src: "https://embed.music.apple.com/us/artist/85070887ade37e3577aaca0a10be38df",
    type: "apple" as const,
  },
];

export default function MusicPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-4xl font-bold">Music</h1>
        <p className="mt-4 text-muted">
          Listen to Wheel on your favorite platform.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {embeds.map((embed) => (
            <div key={embed.title}>
              <h2 className="mb-3 text-xl font-semibold">{embed.title}</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <iframe
                  src={embed.src}
                  width="100%"
                  height="450"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="border-0"
                  title={embed.title}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
