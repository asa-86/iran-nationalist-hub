import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  Save,
  XCircle,
} from "lucide-react";

import {
  getReviewNewsById,
  publishNews,
  rejectNews,
  updateReviewNews,
} from "@/services/news";

import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";

export const Route = createFileRoute(
  "/dashboard_/news_/$id/review",
)({
  component: ReviewNewsPage,
});

function ReviewNewsPage() {
  const { id } = Route.useParams();

  const navigate = useNavigate();

  const [secretariats, setSecretariats] =
    useState<Secretariat[]>([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [secretariatId, setSecretariatId] =
    useState("");

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [item, secretariatData] =
          await Promise.all([
            getReviewNewsById(id),
            getSecretariats(),
          ]);

        if (!active) {
          return;
        }

        if (!item) {
          setErrorMessage(
            "خبر پیدا نشد یا دیگر در انتظار بررسی نیست.",
          );
          return;
        }

        setTitle(item.title);
        setExcerpt(item.excerpt);
        setContent(item.content);

        setSecretariatId(
          item.secretariatId ?? "",
        );

        setSecretariats(
          secretariatData,
        );
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "بارگذاری خبر با مشکل مواجه شد.",
        );
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
  }, [id]);

  async function saveChanges() {
    await updateReviewNews(id, {
      title,
      excerpt,
      content,
      secretariatId:
        secretariatId || null,
    });
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await saveChanges();

      setSuccessMessage(
        "تغییرات خبر ذخیره شد.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ذخیره خبر با مشکل مواجه شد.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    setErrorMessage(null);

    try {
      // ویرایش‌های انجام‌شده ابتدا ذخیره شوند
      await saveChanges();

      await publishNews(id);

      await navigate({
        to: "/dashboard/news/review",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "انتشار خبر با مشکل مواجه شد.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    setSaving(true);
    setErrorMessage(null);

    try {
      // ویرایش‌های احتمالی ذخیره می‌شوند
      await saveChanges();

      await rejectNews(
        id,
        rejectionReason,
      );

      await navigate({
        to: "/dashboard/news/review",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "رد خبر با مشکل مواجه شد.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] items-center justify-center">
        در حال دریافت خبر...
      </div>
    );
  }

  if (errorMessage && !title) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-5 text-destructive">
          {errorMessage}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="text-sm text-muted-foreground">
            تحریریه
          </div>

          <h1 className="mt-1 text-2xl font-black">
            بررسی و ویرایش خبر
          </h1>
        </div>

        <Link
          to="/dashboard/news/review"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold"
        >
          <ArrowRight className="h-4 w-4" />
          صف بررسی
        </Link>
      </div>

      <form
        onSubmit={handleSave}
        className="mt-8 space-y-6"
      >
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <label className="block text-sm font-bold">
            عنوان
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3"
          />

          <label className="mt-5 block text-sm font-bold">
            دبیرخانه
          </label>

          <select
            value={secretariatId}
            onChange={(event) =>
              setSecretariatId(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3"
          >
            <option value="">
              بدون دبیرخانه
            </option>

            {secretariats.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-bold">
            خلاصه
          </label>

          <textarea
            value={excerpt}
            onChange={(event) =>
              setExcerpt(event.target.value)
            }
            rows={3}
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 leading-7"
          />

          <label className="mt-5 block text-sm font-bold">
            متن خبر
          </label>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={16}
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 leading-8"
          />
        </div>

        {successMessage && (
          <div className="rounded-md border border-brand/30 bg-brand/10 p-4 text-sm font-bold text-brand">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold"
          >
            <Save className="h-4 w-4" />
            ذخیره تغییرات
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void handlePublish()
            }
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground"
          >
            <CheckCircle2 className="h-4 w-4" />
            انتشار خبر
          </button>
        </div>

        <div className="rounded-xl border border-destructive/20 p-5">
          <label className="text-sm font-bold">
            رد خبر برای اصلاح
          </label>

          <textarea
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(
                event.target.value,
              )
            }
            rows={3}
            placeholder="دلیل رد یا اصلاحات مورد نیاز را بنویسید..."
            className="mt-3 w-full rounded-md border border-input bg-background px-4 py-3 leading-7"
          />

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void handleReject()
            }
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm font-bold text-destructive"
          >
            <XCircle className="h-4 w-4" />
            رد و بازگرداندن برای اصلاح
          </button>
        </div>
      </form>
    </section>
  );
}
