import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/music", label: "Music" },
  { href: "/shows", label: "Shows" },
  { href: "/contact", label: "Contact" },
  { href: "/merch", label: "Merch" },
];

export function Header() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          WHEEL
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav links={navLinks} />
      </Container>
    </header>
  );
}
