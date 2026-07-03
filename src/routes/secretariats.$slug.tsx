import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getSecretariat, type Secretariat } from "@/data/secretariats";
import { newsBySecretariat, type NewsItem } from "@/data/news";
import { NewsCard } from "@/components/site/NewsCard";

export const Route = createFileRoute("/secretariats/$slug")({
  loader: ({ params }) => {
    const sec = getSecretariat(params.slug);
    if (!sec) throw notFound();
    return { sec, items: newsBySecretariat(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.sec.name} — NIGP` : "دبیرخانه" },
      { name: "description", content: loaderData?.sec.tagline ?? "دبیرخانه حزب" },
    ],
  }),
  component: SecretariatPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">دبیرخانه یافت نشد</h1>
      <Link to="/" className="mt-4 inline-block text-brand hover:underline">
        بازگشت به خانه
      </Link>
    </div>
  ),
});

function SecretariatPage() {
  const { sec, items } = Route.useLoaderData() as { sec: Secretariat; items: NewsItem[] };

  return (
    <div>
      <section className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-brand">دبیرخانه تخصصی</div>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">{sec.name}</h1>
          <p className="mt-2 text-sm opacity-80 md:text-base">{sec.tagline}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <section>
            <h2 className="text-xl font-black text-ink">درباره دبیرخانه</h2>
            <p className="mt-3 text-sm leading-8 text-foreground/85">{sec.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-ink">اخبار این دبیرخانه</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {items.length === 0 && (
                <p className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  خبری برای این دبیرخانه ثبت نشده است.
                </p>
              )}
              {items.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-black text-ink">اعضای دبیرخانه</h3>
            <ul className="mt-4 space-y-3">
              {sec.members.map((m, i) => (
                <li key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-bold text-ink">{m.name}</span>
                  <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-bold text-brand">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
