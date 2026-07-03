import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/charter")({
  head: () => ({
    meta: [
      { title: "اساسنامه — حزب ناسیونالیست بزرگ ایران" },
      { name: "description", content: "متن اساسنامه رسمی حزب ناسیونالیست بزرگ ایران." },
    ],
  }),
  component: Charter,
});

const sections = [
  {
    title: "فصل یکم — کلیات",
    body: "نام رسمی حزب «حزب ناسیونالیست بزرگ ایران» و مخفف بین‌المللی آن NIGP است. مرکز اصلی حزب در تهران بوده و در سراسر ایران فعالیت می‌کند.",
  },
  {
    title: "فصل دوم — اهداف",
    body: "پاسداری از تمامیت ارضی، ترویج فرهنگ ملی، توسعه اقتصادی پایدار، تقویت اقتدار ملی و ارتقای جایگاه ایران در نظام بین‌المللی از اهداف بنیادین حزب هستند.",
  },
  {
    title: "فصل سوم — عضویت",
    body: "هر شهروند ایرانی که به اصول و اهداف حزب باور دارد می‌تواند از طریق فرم رسمی درخواست عضویت خود را ثبت کند. عضویت پس از تأیید مسئولان مربوطه رسمیت می‌یابد.",
  },
  {
    title: "فصل چهارم — ارکان حزب",
    body: "ارکان اصلی حزب عبارت‌اند از رهبر حزب، قائم‌مقام، معاون کل، شورای مرکزی و دبیرخانه‌های تخصصی. وظایف و اختیارات هر رکن در آیین‌نامه داخلی مشخص شده است.",
  },
  {
    title: "فصل پنجم — دبیرخانه‌ها",
    body: "حزب دارای ۹ دبیرخانه تخصصی شامل اخبار، رسانه، تاریخ، اقتصاد، سیاست، جامعه‌شناسی، فلسفه و منطق، ادبیات و فرهنگ، و میلیتاریسم است.",
  },
];

function Charter() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-brand">سند رسمی</div>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">اساسنامه حزب</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          متن رسمی اساسنامه حزب ناسیونالیست بزرگ ایران
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title} className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink">{s.title}</h2>
            <p className="mt-3 text-sm leading-8 text-foreground/85">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
