import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  FilePlus2,
  Save,
  Send,
} from "lucide-react";

import {
  createNews,
} from "@/services/news";
import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";
import {
  getCurrentUser,
  type CurrentUser,
} from "@/services/auth";

export const Route = createFileRoute(
  "/dashboard_/news/new",
)({
  component: NewNewsPage,
});

function NewNewsPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [secretariats, setSecretariats] =
    useState<Secretariat[]>([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [secretariatId, setSecretariatId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [user, secretariatData] =
          await Promise.all([
            getCurrentUser(),
            getSecretariats(),
          ]);

        if (!active) {
          return;
        }

        if (!user) {
          await navigate({
            to: "/login",
          });

          return;
        }

        const canCreateNews =
          user.permissions.some(
            (permission) =>
              permission.name === "news.create",
          );

        if (!canCreateNews) {
          setErrorMessage(
            "شما مجوز افزودن خبر ندارید.",
          );

          setCurrentUser(user);
          return;
        }

        setCurrentUser(user);
        setSecretariats(secretariatData);
      } catch (error) {
        console.error(
          "Failed to load news form:",
          error,
        );

        if (active) {
          setErrorMessage(
            "بارگذاری فرم افزودن خبر با مشکل مواجه شد.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function saveNews(
    status: "draft" | "pending_review",
  ) {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage(
        "عنوان خبر را وارد کنید.",
      );
      return;
    }

    if (!content.trim()) {
      setErrorMessage(
        "متن خبر را وارد کنید.",
      );
      return;
    }

    setSaving(true);

    try {
      await createNews({
        title,
        excerpt,
        content,
        secretariatId:
          secretariatId || null,
        status,
      });

      if (status === "draft") {
        setSuccessMessage(
          "خبر با موفقیت به‌صورت پیش‌نویس ذخیره شد.",
        );
      } else {
        setSuccessMessage(
          "خبر با موفقیت برای بررسی ارسال شد.",
        );
      }

      setTitle("");
      setExcerpt("");
      setContent("");
      setSecretariatId("");
    } catch (error) {
      console.error(
        "Failed to save news:",
        error,
      );

      if (
        error instanceof Error &&
        error.message
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "ذخیره خبر با مشکل مواجه شد.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await saveNews("draft");
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">
          در حال آماده‌سازی فرم...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const canCreateNews =
    currentUser.permissions.some(
      (permission) =>
        permission.name === "news.create",
    );

  if (!canCreateNews) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <h1 className="text-lg font-black text-destructive">
            دسترسی غیرمجاز
          </h1>

          <p className="mt-2 text-sm leading-7 text-destructive">
            این حساب اجازه افزودن خبر ندارد.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-bold"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به پنل
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FilePlus2 className="h-4 w-4" />
            مدیریت اخبار
          </div>

          <h1 className="mt-1 text-2xl font-black text-ink md:text-3xl">
            افزودن خبر جدید
          </h1>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-accent"
        >
          <ArrowRight className="h-4 w-4" />
          پنل کاربری
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold"
            >
              عنوان خبر
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="عنوان خبر را وارد کنید"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="secretariat"
              className="mb-2 block text-sm font-bold"
            >
              دبیرخانه
            </label>

            <select
              id="secretariat"
              value={secretariatId}
              onChange={(event) =>
                setSecretariatId(
                  event.target.value,
                )
              }
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">
                بدون دبیرخانه
              </option>

              {secretariats.map(
                (secretariat) => (
                  <option
                    key={secretariat.id}
                    value={secretariat.id}
                  >
                    {secretariat.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="mt-5">
            <label
              htmlFor="excerpt"
              className="mb-2 block text-sm font-bold"
            >
              خلاصه خبر
            </label>

            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              rows={3}
              className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-sm leading-7 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="خلاصه کوتاهی برای نمایش در کارت خبر"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-bold"
            >
              متن خبر
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              required
              rows={14}
              className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-sm leading-8 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="متن کامل خبر را وارد کنید..."
            />
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-md border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {saving
              ? "در حال ذخیره..."
              : "ذخیره پیش‌نویس"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void saveNews(
                "pending_review",
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            ارسال برای بررسی
          </button>
        </div>
      </form>
    </section>
  );
}