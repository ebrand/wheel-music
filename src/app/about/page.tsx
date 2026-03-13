import { createPublicServerClient } from "@/lib/supabase/server";
import { BandMember, BandInfo } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { MemberCard } from "@/components/about/MemberCard";

export const metadata = { title: "About | Wheel" };

export default async function AboutPage() {
  const supabase = await createPublicServerClient();

  const [membersResult, bioResult] = await Promise.all([
    supabase
      .from("band_members")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("band_info").select("*").eq("key", "bio").single(),
  ]);

  const members = (membersResult.data as BandMember[]) || [];
  const bio = (bioResult.data as BandInfo | null)?.value;

  return (
    <section className="py-16">
      <Container>
        <h1 className="text-4xl font-bold">About Wheel</h1>
        {bio && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {bio}
          </p>
        )}

        {members.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">The Band</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
