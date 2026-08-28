import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  getSecretariatWithMembers,
  type Secretariat,
} from "@/services/secretariats";
import {
  getNewsBySecretariat,
  type NewsItem,
} from "@/services/news";
import { NewsCard } from "@/components/site/NewsCard";

export const Route = createFileRoute("/secretariats/$slug")({
  loader: async ({ params }) => {
    const sec = await getSecretariatWithMembers(params.slug);

    if (!sec) {
      throw notFound();
    }

    const items = await getNewsBySecretariat(sec.slug);

    return {
      sec,
      items,
    };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.sec.name} — NIGP`
          : "دبیرخانه",
      },
      {
        name: "description",
        content:
          loaderData?.sec.tagline ??
          "دبیرخانه حزب ناسیونالیست بزرگ ایران",
      },
    ],
  }),

  component: SecretariatPage,

  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">
        دبیرخانه یافت نشد
      </h1>

      <Link
        to="/"
        className="mt-4 inline-block text-brand hover:underline"
      >
        بازگشت به خانه
      </Link>
    </div>
  ),
});

function SecretariatPage() {
  const { sec, items } = Route.useLoaderData() as {
    sec: Secretariat;
    items: NewsItem[];
  };

  return (
    <div>
      <section className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-brand">
            دبیرخانه تخصصی
          </div>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            {sec.name}
          </h1>

          {sec.tagline && (
            <p className="mt-2 text-sm opacity-80 md:text-base">
              {sec.tagline}
            </p>
          )}
        </div>
      </section>
      
      {sec.posterUrl && (
      
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      
            <img
      
              src={sec.posterUrl}
      
              alt={`پوستر ${sec.name}`}
      
              className="h-auto w-full object-cover"
      
              loading="lazy"
      
            />
      
          </div>
      
        </section>
      
      )}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <section>
            <h2 className="text-xl font-black text-ink">
              درباره دبیرخانه
            </h2>

            <p className="mt-3 text-sm leading-8 text-foreground/85">
              {sec.description || "توضیحی برای این دبیرخانه ثبت نشده است."}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-ink">
              اخبار این دبیرخانه
            </h2>

            <div className="mt-4 grid items-stretch gap-6 sm:grid-cols-2">
              {items.length === 0 && (
                <p className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  خبری برای این دبیرخانه ثبت نشده است.
                </p>
              )}

              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-black text-ink">
              اعضای دبیرخانه
            </h3>

            <ul className="mt-4 space-y-3">
              {sec.members.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  هنوز عضوی برای این دبیرخانه ثبت نشده است.
                </li>
              )}

              {sec.members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-bold text-ink">
                    {member.name}
                  </span>

                  <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-bold text-brand">
                    {member.role}
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