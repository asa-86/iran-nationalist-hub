import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
  formatDate,
  getNewsById,
} from "@/services/news";


export const Route = createFileRoute("/news/$id")({
  loader: async ({ params }) => {
    const item = await getNewsById(params.id);

    if (!item) {
      throw notFound();
    }

    return { item };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title} — NIGP`
          : "خبر",
      },
      {
        name: "description",
        content: loaderData?.item.excerpt ?? "خبر حزب",
      },
    ],
  }),

  component: NewsDetail,

  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">
        خبر یافت نشد
      </h1>

      <Link
        to="/news"
        className="mt-4 inline-block text-brand hover:underline"
      >
        بازگشت به اخبار
      </Link>
    </div>
  ),
});

type Comment = {
  id: number;
  author: string;
  text: string;
  replies: Comment[];
};

function NewsDetail() {
  const { item } = Route.useLoaderData();


  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);

  function addComment() {
    if (!text.trim()) {
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      author: "کاربر مهمان",
      text: text.trim(),
      replies: [],
    };

    if (replyTo === null) {
      setComments((current) => [comment, ...current]);
    } else {
      setComments((current) =>
        current.map((item) =>
          item.id === replyTo
            ? {
                ...item,
                replies: [...item.replies, comment],
              }
            : item,
        ),
      );
    }

    setText("");
    setReplyTo(null);
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

      {/* اطلاعات بالای خبر */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {item.secretariatSlug && (
          <Link
            to="/secretariats/$slug"
            params={{ slug: item.secretariatSlug }}
            className="rounded-md bg-brand/10 px-2.5 py-1 font-bold text-brand hover:bg-brand/15"
          >
            {item.secretariatName}
          </Link>
        )}

        <span className="text-muted-foreground">
          {formatDate(item.publishedAt)}
        </span>
      </div>

      {/* عنوان */}
      <h1 className="mt-4 text-3xl font-black leading-[1.35] text-ink md:text-4xl">
        {item.title}
      </h1>

      {/* نویسنده */}
      {item.author && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          نویسنده: {item.author}
        </div>
      )}

      {/* عکس */}
      {item.coverImageUrl && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={item.coverImageUrl}
            alt={item.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* متن خبر */}
      <div className="prose prose-neutral mt-8 max-w-none text-[15px] leading-9 text-foreground/90 prose-p:my-6">
        <ReactMarkdown>
          {item.body}
        </ReactMarkdown>
      </div>

      {/* دبیرخانه منتشرکننده */}
      {item.secretariatSlug && (
        <div className="mt-8 rounded-lg border border-border bg-muted/40 p-4 text-sm">
          این خبر توسط{" "}
          <Link
            to="/secretariats/$slug"
            params={{ slug: item.secretariatSlug }}
            className="font-bold text-brand"
          >
            {item.secretariatName}
          </Link>{" "}
          منتشر شده است.
        </div>
      )}

      {/* نظرات */}
      <section className="mt-12 border-t border-border pt-8">

        <div className="mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand" />

          <h2 className="text-xl font-black text-ink">
            نظرات
          </h2>
        </div>

        {/* فرم ارسال نظر */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">

          {replyTo !== null && (
            <div className="mb-2 flex items-center justify-between rounded bg-muted px-3 py-2 text-xs">
              <span>
                در حال پاسخ به نظر
              </span>

              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-brand"
              >
                انصراف
              </button>
            </div>
          )}

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            placeholder="نظر خود را بنویسید…"
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={addComment}
              className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
            >
              ارسال نظر
            </button>
          </div>
        </div>

        {/* لیست نظرات */}
        <div className="mt-6 space-y-4">

          {comments.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              هنوز نظری ثبت نشده است. اولین نفر باشید.
            </p>
          )}

          {comments.map((comment) => (
            <CommentView
              key={comment.id}
              c={comment}
              onReply={() => setReplyTo(comment.id)}
            />
          ))}

        </div>
      </section>
    </article>
  );
}

function CommentView({
  c,
  onReply,
}: {
  c: Comment;
  onReply: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">

      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-ink">
          {c.author}
        </span>

        <button
          type="button"
          onClick={onReply}
          className="font-bold text-brand hover:underline"
        >
          پاسخ
        </button>
      </div>

      <p className="mt-2 text-sm leading-7 text-foreground/90">
        {c.text}
      </p>

      {c.replies.length > 0 && (
        <div className="mr-4 mt-4 space-y-3 border-r-2 border-brand/30 pr-4">

          {c.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-md bg-muted/60 p-3"
            >
              <div className="text-xs font-bold text-ink">
                {reply.author}
              </div>

              <p className="mt-1 text-sm leading-7">
                {reply.text}
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}