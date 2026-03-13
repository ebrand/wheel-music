"use client";

import Link from "next/link";
import { useStytch } from "@stytch/nextjs";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const stytch = useStytch();
  const router = useRouter();

  function handleLogout() {
    stytch.session.revoke();
    router.replace("/admin/login");
  }

  return (
    <AuthGuard>
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/admin/shows">
              <Card className="transition-colors hover:border-accent">
                <h2 className="text-xl font-semibold">Manage Shows</h2>
                <p className="mt-2 text-sm text-muted">
                  Add, edit, and remove show dates
                </p>
              </Card>
            </Link>

            <Link href="/admin/content">
              <Card className="transition-colors hover:border-accent">
                <h2 className="text-xl font-semibold">Manage Content</h2>
                <p className="mt-2 text-sm text-muted">
                  Edit band bio and member profiles
                </p>
              </Card>
            </Link>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
