import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-lg font-semibold">WHEEL</p>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/mailing-list" className="hover:text-foreground">
              Mailing List
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="/shows" className="hover:text-foreground">
              Shows
            </Link>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <p>&copy; {new Date().getFullYear()} Wheel. All rights reserved.</p>
            <Link href="/admin/login" className="hover:text-foreground">
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
