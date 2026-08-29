import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  FilePenLine,
  FilePlus2,
  Send,
} from "lucide-react";

import {
  formatDate,
  getMyNews,
  submitNewsForReview,
  type ManagedNewsItem,
  type ManagedNewsStatus,
} from "@/services/news";
import { getCurrentUser } from "@/services/auth";

export const Route = createFileRoute(
  "/dashboard_/news",
)({
  component: MyNewsPage,
});

const statusLabels: Record<
  ManagedNewsStatus,
  string
> = {
  draft: "پیش‌نویس",
  pending_review: "در انتظار بررسی",
  published: "منتشر شده",
  rejected: "نیازمند اصلاح",
};

function MyNewsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<
    ManagedNewsItem[]
  >([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [canEditAny, setCanEditAny] = useState(false);
  const [canPublish, setCanPublish] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submittingId, setSubmittingId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function loadNews() {
    try {
      setErrorMessage(null);

      const user = await getCurrentUser();

      if (!user) {
        await navigate({
          to: "/login",
        });
        return;
      }

      setCurrentUserId(user.id);
      setCanEditAny(
        user.permissions.some(
          (permission) => permission.name === "news.edit_any",
        ),
      );
      setCanPublish(
        user.permissions.some(
          (permission) => permission.name === "news.publish",
        ),
      );

      const news = await getMyNews();

      setItems(news);
    } catch (error) {
      console.error(
        "Failed to load managed news:",
        error,
      );

      setErrorMessage(
        "دریافت مطالب شما با مشکل مواجه شد.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNews();
  }, []);

  async function handleSubmitForReview(
    id: string,
  ) {
    try {
      setSubmittingId(id);
      setErrorMessage(null);

      await submitNewsForReview(id);

      await loadNews();
    } catch (error) {
      console.error(
        "Failed to submit news:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ارسال مطلب برای بررسی با مشکل مواجه شد.",
      );
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">
          در حال دریافت مطالب...
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            مدیریت محتوا
          </div>

          <h1 className="mt-1 text-2xl font-black text-ink md:text-3xl">
            مطالب من
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard/news/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
          >
            <FilePlus2 className="h-4 w-4" />
            افزودن مطلب
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-accent"
          >
            <ArrowRight className="h-4 w-4" />
            پنل کاربری
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <FilePenLine className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 font-black text-ink">
            هنوز مطلبی ثبت نکرده‌اید
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            اولین مطلب خود را ایجاد کنید.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => {
            const editable =
              canEditAny
                ? item.status !== "published" || canPublish
                : item.authorId === currentUserId &&
                  (item.status === "draft" || item.status === "rejected");
            const canSubmit =
              item.authorId === currentUserId &&
              (item.status === "draft" || item.status === "rejected");

            return (
              <article
                key={item.id}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">
                        {statusLabels[item.status]}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {item.secretariatName}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-black text-ink">
                      {item.title}
                    </h2>

                    {item.excerpt && (
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                        {item.excerpt}
                      </p>
                    )}

                    {item.status === "rejected" &&
                      item.rejectionReason && (
                        <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                          علت رد:
                          {" "}
                          {item.rejectionReason}
                        </div>
                      )}

                    <div className="mt-4 text-xs text-muted-foreground">
                      ایجاد:
                      {" "}
                      {formatDate(item.createdAt)}
                    </div>
                  </div>

                  {editable && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link
                        to="/dashboard/news/$id/edit"
                        params={{
                          id: item.id,
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-bold hover:bg-accent"
                      >
                        <FilePenLine className="h-4 w-4" />
                        ویرایش
                      </Link>

                      {canSubmit && (
                        <button
                          type="button"
                          disabled={submittingId === item.id}
                          onClick={() => void handleSubmitForReview(item.id)}
                          className="inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
                        >
                          <Send className="h-4 w-4" />
                          {submittingId === item.id
                            ? "در حال ارسال..."
                            : "ارسال برای بررسی"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
