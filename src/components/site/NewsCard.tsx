import { Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper } from "lucide-react";
import { useState } from "react";

import {
  formatDate,
  type NewsItem,
} from "@/services/news";

function NewsCardMedia({
  coverImageUrl,
}: {
  coverImageUrl: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(coverImageUrl) && !imageFailed;

  return (
    <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted">
      {showImage ? (
        <img
          src={coverImageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand/[0.06] via-muted to-brand/[0.12]"
          aria-hidden
        >
          <Newspaper className="h-9 w-9 text-brand/35" strokeWidth={1.5} />
          <span className="text-[11px] font-bold tracking-wide text-brand/40">
            NIGP
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
    </div>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      to="/news/$id"
      params={{ id: item.id }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-soft"
    >
      <NewsCardMedia coverImageUrl={item.coverImageUrl} />

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="min-w-0 truncate rounded-md bg-brand/10 px-2.5 py-1 font-bold text-brand">
            {item.secretariatName || "حزب"}
          </span>

          {item.publishedAt && (
            <time
              className="shrink-0 text-muted-foreground"
              dateTime={item.publishedAt}
            >
              {formatDate(item.publishedAt)}
            </time>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-7 text-ink transition-colors group-hover:text-brand">
          {item.title}
        </h3>

        {item.excerpt ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
            {item.excerpt}
          </p>
        ) : (
          <div className="flex-1" aria-hidden />
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand">
          <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
            مطالعه مطلب
          </span>
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
