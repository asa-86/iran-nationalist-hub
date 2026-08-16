import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { NewsCard } from "@/components/site/NewsCard";
import type { NewsItem } from "@/data/news";

import { getNews } from "@/services/news";
import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      {
        title: "اخبار — حزب ناسیونالیست بزرگ ایران",
      },
      {
        name: "description",
        content: "آرشیو اخبار و اطلاعیه‌های حزب.",
      },
    ],
  }),

  component: NewsList,
});

function NewsList() {
  const [filter, setFilter] = useState<string>("all");

  const [news, setNews] = useState<NewsItem[]>([]);
  const [secretariats, setSecretariats] = useState<Secretariat[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        const [newsData, secretariatsData] = await Promise.all([
          getNews(),
          getSecretariats(),
        ]);

        setNews(newsData);
        setSecretariats(secretariatsData);
      } catch (error) {
        console.error("Failed to load news page:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered =
    filter === "all"
      ? news
      : news.filter(
          (item) => item.secretariatSlug === filter,
        );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-brand">
          آرشیو
        </div>

        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">
          اخبار حزب
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          تازه‌ترین اخبار و اطلاعیه‌های منتشرشده توسط دبیرخانه‌های حزب.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          همه
        </FilterChip>

        {secretariats.map((s) => (
          <FilterChip
            key={s.slug}
            active={filter === s.slug}
            onClick={() => setFilter(s.slug)}
          >
            {s.name}
          </FilterChip>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            در حال دریافت اخبار...
          </div>
        )}

        {!loading && error && (
          <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            دریافت اخبار با خطا مواجه شد.
          </div>
        )}

        {!loading &&
          !error &&
          filtered.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
            />
          ))}

        {!loading &&
          !error &&
          filtered.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              خبری برای این دبیرخانه ثبت نشده است.
            </div>
          )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors " +
        (active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-card text-foreground hover:bg-accent")
      }
    >
      {children}
    </button>
  );
}