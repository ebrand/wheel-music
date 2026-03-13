"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SubscribeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to subscribe");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">You&apos;re on the list!</p>
        <p className="mt-2 text-sm text-muted">
          Thanks for subscribing. We&apos;ll keep you posted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
            First Name
          </label>
          <Input id="firstName" name="firstName" placeholder="First name" />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
            Last Name
          </label>
          <Input id="lastName" name="lastName" placeholder="Last name" />
        </div>
      </div>
      <div>
        <label htmlFor="subscribe-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <Input
          id="subscribe-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
