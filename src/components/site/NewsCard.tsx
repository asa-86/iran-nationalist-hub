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
      className="group block rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-md bg-brand/10 px-2 py-1 font-medium text-brand">
          {item.secretariatName || "حزب"}
        </span>

        <span className="text-muted-foreground">
          {formatDate(item.publishedAt)}
        </span>
      </div>

      <h3 className="mt-3 text-base font-bold leading-7 text-ink group-hover:text-brand">
        {item.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">
        {item.excerpt}
      </p>
    </Link>
  );
}