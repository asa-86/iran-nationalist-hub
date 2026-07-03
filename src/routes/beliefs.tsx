import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/beliefs")({
  head: () => ({
    meta: [
      { title: "عقاید — حزب ناسیونالیست بزرگ ایران" },
      { name: "description", content: "اصول فکری و باورهای بنیادین حزب." },
    ],
  }),
  component: Beliefs,
});

const beliefs = [
  {
    title: "ناسیونالیسم ایرانی",
    body: "باور به هویت ملی ایرانی، پاسداشت میراث تاریخی و فرهنگی و اولویت منافع ملی در همه تصمیم‌های راهبردی.",
  },
  {
    title: "تمامیت ارضی",
    body: "دفاع بی‌قید و شرط از تمامیت ارضی ایران و حفظ یکپارچگی سرزمینی به‌عنوان اصل غیرقابل مذاکره.",
  },
  {
    title: "توسعه ملی",
    body: "پیگیری توسعه اقتصادی، علمی و اجتماعی بر پایه ظرفیت‌های داخلی و کاهش وابستگی به قدرت‌های بیگانه.",
  },
  {
    title: "خردگرایی و علم",
    body: "تصمیم‌گیری بر پایه دانش، تحلیل روشمند و اندیشه‌ورزی انتقادی، نه شعار و احساسات لحظه‌ای.",
  },
  {
    title: "زبان و فرهنگ",
    body: "پاسداشت زبان فارسی و زبان‌های ایرانی، حمایت از ادبیات، هنر و میراث فرهنگی ایران‌زمین.",
  },
  {
    title: "اقتدار ملی",
    body: "تقویت بنیه دفاعی و امنیت ملی به‌عنوان پیش‌شرط استقلال سیاسی و توسعه پایدار کشور.",
  },
];

function Beliefs() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-brand">مانیفست</div>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">عقاید ما</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          اصول فکری بنیادین که چهارچوب سیاست‌گذاری و کنش سیاسی حزب را شکل می‌دهند.
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {beliefs.map((b, i) => (
          <article key={b.title} className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand text-brand-foreground font-black">
                {(i + 1).toLocaleString("fa-IR")}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-ink">{b.title}</h2>
                <p className="mt-2 text-sm leading-8 text-foreground/85">{b.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
