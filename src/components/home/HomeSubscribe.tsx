import { Container } from "@/components/ui/Container";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

export function HomeSubscribe() {
  return (
    <section className="py-16">
      <Container className="max-w-xl text-center">
        <h2 className="text-2xl font-bold">Stay in the Loop</h2>
        <p className="mt-2 text-muted">
          Sign up for updates on new music, shows, and more.
        </p>
        <div className="mt-6">
          <SubscribeForm />
        </div>
      </Container>
    </section>
  );
}
