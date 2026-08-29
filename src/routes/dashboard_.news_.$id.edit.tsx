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
  Save,
  Send,
} from "lucide-react";

import {
  getMyNewsById,
  submitNewsForReview,
  updateOwnNews,
} from "@/services/news";
import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";
import { getCurrentUser } from "@/services/auth";
import { NewsContentTextarea } from "@/components/dashboard/NewsContentTextarea";
import { normalizeNewsImageLinks } from "@/lib/news-content";

export const Route = createFileRoute(
  "/dashboard_/news_/$id/edit",
)({
  component: EditNewsPage,
});

function EditNewsPage() {
  const { id } = Route.useParams();

  const navigate = useNavigate();

  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [secretariats, setSecretariats] =
    useState<Secretariat[]>([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] =
    useState("");
  const [content, setContent] =
    useState("");
  const [secretariatId, setSecretariatId] =
    useState("");

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [item, secretariatData, user] =
          await Promise.all([
            getMyNewsById(id),
            getSecretariats(),
            getCurrentUser(),
          ]);

        if (!active) {
          return;
        }

        if (!item) {
          setErrorMessage(
            "مطلب مورد نظر پیدا نشد.",
          );
          return;
        }

        const canEditAny = user?.permissions.some(
          (permission) => permission.name === "news.edit_any",
        );
        const canPublish = user?.permissions.some(
          (permission) => permission.name === "news.publish",
        );
        const isOwner = item.authorId === user?.id;
        const editable = canEditAny
          ? item.status !== "published" || canPublish
          : isOwner &&
            (item.status === "draft" || item.status === "rejected");

        if (!editable) {
          setErrorMessage(
            "این مطلب در وضعیت فعلی قابل ویرایش نیست.",
          );
          return;
        }

        setTitle(item.title);
        setAuthor(item.author);
        setCoverImageUrl(item.coverImageUrl);
        setExcerpt(item.excerpt);
        setContent(item.content);
        setSecretariatId(
          item.secretariatId ?? "",
        );
        setStatus(item.status);

        setSecretariats(
          secretariatData,
        );
      } catch (error) {
        console.error(
          "Failed to load edit page:",
          error,
        );

        setErrorMessage(
          "دریافت اطلاعات مطلب با مشکل مواجه شد.",
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

  async function save() {
    await updateOwnNews(id, {
      title,
      author,
      excerpt,
      content: normalizeNewsImageLinks(content),
      coverImageUrl,
      secretariatId:
        secretariatId || null,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await save();

      setSuccessMessage(
        "تغییرات مطلب ذخیره شد.",
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ذخیره تغییرات با مشکل مواجه شد.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSendForReview() {
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await save();

      await submitNewsForReview(id);

      await navigate({
        to: "/dashboard/news",
      });
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ارسال مطلب برای بررسی با مشکل مواجه شد.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">
          در حال دریافت مطلب...
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="text-sm text-muted-foreground">
            مدیریت مطالب
          </div>

          <h1 className="mt-1 text-2xl font-black text-ink">
            ویرایش مطلب
          </h1>

          {status && (
            <div className="mt-2 text-xs text-muted-foreground">
              وضعیت:
              {" "}
              {status}
            </div>
          )}
        </div>

        <Link
          to="/dashboard/news"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-accent"
        >
          <ArrowRight className="h-4 w-4" />
          مطالب من
        </Link>
      </div>

      {errorMessage && !title ? (
        <div className="mt-8 rounded-md border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div>
              <label className="mb-2 block text-sm font-bold">
                عنوان
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                نام نویسنده
              </label>

              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
                placeholder="نام نویسنده مطلب را وارد کنید"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="coverImageUrl"
                className="mb-2 block text-sm font-bold"
              >
                لینک تصویر شاخص مطلب
              </label>
                          
              <input
                id="coverImageUrl"
                type="url"
                value={coverImageUrl}
                onChange={(event) =>
                  setCoverImageUrl(event.target.value)
                }
                dir="ltr"
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="https://example.com/image.jpg"
              />
            
              {coverImageUrl && (
                <div className="mt-3 overflow-hidden rounded-lg border border-border">
                  <img
                    src={coverImageUrl}
                    alt="پیش‌نمایش تصویر شاخص"
                    className="max-h-80 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                دبیرخانه
              </label>

              <select
                value={secretariatId}
                onChange={(event) =>
                  setSecretariatId(
                    event.target.value,
                  )
                }
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
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
              <label className="mb-2 block text-sm font-bold">
                خلاصه
              </label>

              <textarea
                value={excerpt}
                onChange={(event) =>
                  setExcerpt(
                    event.target.value,
                  )
                }
                rows={3}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm leading-7"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                متن مطلب
              </label>

              <NewsContentTextarea
                value={content}
                onValueChange={setContent}
                rows={15}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm leading-8"
              />
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                لینک مستقیم تصویر را در خط دلخواه قرار دهید؛ لینک خودکار به تصویر تبدیل می‌شود.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-brand/30 bg-brand/10 p-4 text-sm font-bold text-brand">
              {successMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold hover:bg-accent disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              ذخیره تغییرات
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void handleSendForReview()
              }
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              ارسال برای بررسی
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
