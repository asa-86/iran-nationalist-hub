import { Link } from "@tanstack/react-router";

import {
  formatDate,
  type NewsItem,
} from "@/services/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      to="/news/$id"
      params={{ id: item.id }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      {item.coverImageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={item.coverImageUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="max-w-full truncate rounded-md bg-brand/10 px-2 py-1 font-medium text-brand">
            {item.secretariatName || "حزب"}
          </span>

          <span className="text-muted-foreground">
            {formatDate(item.publishedAt)}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-base font-bold leading-7 text-ink transition-colors group-hover:text-brand">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">
            {item.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}