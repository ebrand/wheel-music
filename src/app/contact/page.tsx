import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = { title: "Contact | Wheel" };

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container className="max-w-xl">
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-4 text-muted">
          Got a question, booking inquiry, or just want to say hi? Drop us a line.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
