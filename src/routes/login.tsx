import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

import { signIn } from "@/services/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setLoading(true);

    try {
      await signIn(email.trim(), password);

      await navigate({
        to: "/dashboard",
      });
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage(
        "ایمیل یا رمز عبور صحیح نیست.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="flex justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
            <LockKeyhole className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-2xl font-black text-ink">
            ورود به سامانه حزب
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            برای دسترسی به پنل کاربری وارد حساب خود شوید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-foreground"
            >
              ایمیل
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-foreground"
            >
              رمز عبور
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          {errorMessage && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand px-4 py-3 text-sm font-bold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </section>
  );
}