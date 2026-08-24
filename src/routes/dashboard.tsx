import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  getCurrentUser,
  signOut,
  type CurrentUser,
} from "@/services/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const user = await getCurrentUser();

        if (!active) {
          return;
        }

        if (!user) {
          await navigate({
            to: "/login",
          });

          return;
        }

        setCurrentUser(user);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error,
        );

        if (active) {
          setErrorMessage(
            "دریافت اطلاعات حساب کاربری با مشکل مواجه شد.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSignOut() {
    try {
      await signOut();

      await navigate({
        to: "/",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">
          در حال دریافت اطلاعات حساب...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const {
    user,
    profile,
    roles,
    permissions,
  } = currentUser;

  const canCreateNews = permissions.some(
    (permission) =>
      permission.name === "news.create",
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            پنل کاربری
          </div>

          <h1 className="mt-1 text-2xl font-black text-ink md:text-3xl">
            {profile?.fullName ||
              profile?.username ||
              user.email ||
              "کاربر"}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold transition hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          خروج از حساب
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/10 text-brand">
              <UserRound className="h-5 w-5" />
            </div>

            <h2 className="font-black text-ink">
              اطلاعات حساب
            </h2>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">
                نام
              </dt>

              <dd className="mt-1 font-bold">
                {profile?.fullName || "ثبت نشده"}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                نام کاربری
              </dt>

              <dd className="mt-1 font-bold">
                {profile?.username || "ثبت نشده"}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                ایمیل
              </dt>

              <dd
                className="mt-1 font-bold"
                dir="ltr"
              >
                {user.email || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                وضعیت
              </dt>

              <dd className="mt-1">
                <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-bold text-brand">
                  {profile?.status || "نامشخص"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/10 text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="font-black text-ink">
              نقش‌ها
            </h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <span
                  key={`${role.name}-${role.secretariatId ?? "global"}-${index}`}
                  className="rounded-md border border-border bg-muted px-3 py-2 text-sm font-bold"
                >
                  {role.title}
                </span>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                نقشی برای این حساب ثبت نشده است.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/10 text-brand">
              <KeyRound className="h-5 w-5" />
            </div>

            <h2 className="font-black text-ink">
              دسترسی‌ها
            </h2>
          </div>

          <div className="mt-5 space-y-2">
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <div
                  key={permission.name}
                  className="rounded-md border border-border px-3 py-2"
                >
                  <div className="text-sm font-bold">
                    {permission.title}
                  </div>

                  <div
                    className="mt-1 text-xs text-muted-foreground"
                    dir="ltr"
                  >
                    {permission.name}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                دسترسی ویژه‌ای برای این حساب وجود ندارد.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-black text-ink">
          ابزارهای مدیریتی
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          ابزارهای این بخش بر اساس دسترسی‌های حساب شما نمایش داده می‌شوند.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {canCreateNews ? (
            <div className="rounded-md bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
              شما مجوز افزودن خبر دارید.
            </div>
          ) : (
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
              مجوز افزودن خبر برای این حساب فعال نیست.
            </div>
          )}

          <Link
            to="/"
            className="rounded-md border border-border px-4 py-3 text-sm font-bold hover:bg-accent"
          >
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </section>
  );
}