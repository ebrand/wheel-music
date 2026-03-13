import { Container } from "@/components/ui/Container";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

export const metadata = { title: "Mailing List | Wheel" };

export default function MailingListPage() {
  return (
    <section className="py-16">
      <Container className="max-w-xl">
        <h1 className="text-4xl font-bold">Mailing List</h1>
        <p className="mt-4 text-muted">
          Sign up to hear about new music, shows, and other updates from Wheel.
        </p>
        <div className="mt-8">
          <SubscribeForm />
        </div>
      </Container>
    </section>
  );
}
