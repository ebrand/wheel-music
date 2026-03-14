import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="py-12">
      <Container>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">WHEEL</p>
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
