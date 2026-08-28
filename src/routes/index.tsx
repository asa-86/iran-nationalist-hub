import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { NewsCard } from "@/components/site/NewsCard";
import {
  formatDate,
  getNews,
  type NewsItem,
} from "@/services/news";
import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [secretariats, setSecretariats] = useState<Secretariat[]>([]);

  useEffect(() => {
    Promise.all([
      getNews(),
      getSecretariats(),
    ])
      .then(([newsData, secretariatData]) => {
        setNews(newsData);
        setSecretariats(secretariatData);
      })
      .catch((error) => {
        console.error("Failed to load homepage data:", error);
      });
  }, []);

  const latestNews = news.slice(0, 3);
  const announcements = news.slice(0, 3);
  const latestAnnouncement = announcements[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-ink text-ink-foreground">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.52 0.22 27) 0, transparent 45%), radial-gradient(circle at 80% 80%, oklch(0.99 0 0) 0, transparent 40%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-brand" />
              پایگاه رسمی حزب
            </div>

            <h1 className="mt-4 text-3xl font-black leading-[1.3] md:text-5xl md:leading-[1.25]">
              حزب ناسیونالیست بزرگ ایران
              <span className="mt-2 block text-brand">
                برای ایرانی سربلند و آباد
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 opacity-85 md:text-base">
              ما با تکیه بر میراث تاریخی، فرهنگ ملی و اندیشه‌ورزی روشمند، در پی
              طراحی راهبردی برای آینده ایران هستیم. اخبار، اطلاعیه‌ها و فعالیت
              دبیرخانه‌های تخصصی حزب را در این پایگاه دنبال کنید.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/membership"
                className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground shadow-soft hover:bg-brand/90"
              >
                درخواست عضویت
              </Link>

              <Link
                to="/beliefs"
                className="rounded-md border border-white/20 px-5 py-3 text-sm font-bold hover:bg-white/10"
              >
                عقاید ما
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            {latestAnnouncement && (
              <>
                <div className="text-xs opacity-70">
                  آخرین مطلب
                </div>

                <div className="mt-2 text-lg font-bold leading-8">
                  {latestAnnouncement.title}
                </div>

                <p className="mt-2 text-sm leading-7 opacity-80">
                  {latestAnnouncement.excerpt}
                </p>

                <Link
                  to="/news/$id"
                  params={{
                    id: latestAnnouncement.id,
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline"
                >
                  مطالعه بیشتر
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-ink md:text-3xl">
              آخرین مطالب
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              گزیده‌ای از تازه‌ترین مطالب دبیرخانه‌های حزب
            </p>
          </div>

          <Link
            to="/news"
            className="shrink-0 text-sm font-bold text-brand hover:underline"
          >
            همه مطالب
          </Link>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-black text-ink md:text-3xl">
            آخرین اطلاعیه‌ها
          </h2>

          <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                to="/news/$id"
                params={{
                  id: announcement.id,
                }}
                className="flex flex-col gap-2 p-5 hover:bg-accent/50 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-bold text-ink">
                    {announcement.title}
                  </div>

                  <div className="mt-1 truncate text-sm text-muted-foreground">
                    {announcement.excerpt}
                  </div>
                </div>

                <div className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(announcement.publishedAt)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Secretariats */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black text-ink md:text-3xl">
          دبیرخانه‌های حزب
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          هسته‌های تخصصی حزب در حوزه‌های گوناگون فکری و اجرایی
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secretariats.map((secretariat) => (
            <Link
              key={secretariat.slug}
              to="/secretariats/$slug"
              params={{
                slug: secretariat.slug,
              }}
              className="group rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-brand/10">
                  <img
                    src={secretariat.logo}
                    alt={secretariat.name}
                    className="h-9 w-auto shrink-0 rounded"
                  />
                </div>

                <div className="min-w-0">
                  <div className="truncate font-bold text-ink group-hover:text-brand">
                    {secretariat.name}
                  </div>

                  <div className="truncate text-xs text-muted-foreground">
                    {secretariat.tagline}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-xl bg-brand p-8 text-brand-foreground md:p-12">
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-2xl font-black md:text-3xl">
              به صف ما بپیوندید
            </h3>

            <p className="mt-3 text-sm leading-7 opacity-95 md:text-base">
              با ثبت درخواست عضویت، بخشی از حرکت ملی حزب ناسیونالیست بزرگ ایران
              شوید. درخواست شما پس از بررسی، توسط مسئولان مربوطه پاسخ داده می‌شود.
            </p>

            <Link
              to="/membership"
              className="mt-6 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-bold text-ink-foreground hover:bg-ink/90"
            >
              ثبت درخواست عضویت
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}