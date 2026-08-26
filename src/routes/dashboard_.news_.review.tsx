import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";

import {
  formatDate,
  getPendingNews,
  type ManagedNewsItem,
} from "@/services/news";

export const Route = createFileRoute(
  "/dashboard_/news_/review",
)({
  component: NewsReviewQueuePage,
});

function NewsReviewQueuePage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<
    ManagedNewsItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const data = await getPendingNews();

        if (active) {
          setItems(data);
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "دریافت اخبار با مشکل مواجه شد.",
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

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] items-center justify-center">
        در حال دریافت اخبار...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="text-sm text-muted-foreground">
            تحریریه
          </div>

          <h1 className="mt-1 text-2xl font-black text-ink">
            اخبار در انتظار بررسی
          </h1>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold"
        >
          <ArrowRight className="h-4 w-4" />
          پنل کاربری
        </Link>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {!errorMessage && items.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <ClipboardCheck className="mx-auto h-8 w-8 text-muted-foreground" />

          <div className="mt-3 font-bold">
            خبری در انتظار بررسی نیست.
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>
                    {item.secretariatName}
                  </span>

                  <span>
                    {formatDate(item.updatedAt)}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-black">
                  {item.title}
                </h2>

                {item.excerpt && (
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.excerpt}
                  </p>
                )}
              </div>

              <Link
                to="/dashboard/news/$id/review"
                params={{
                  id: item.id,
                }}
                className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
              >
                بررسی خبر
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
