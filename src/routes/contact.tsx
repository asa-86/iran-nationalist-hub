import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, MapPin, Instagram, Youtube } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "ارتباط با ما — حزب ناسیونالیست بزرگ ایران" },
      { name: "description", content: "راه‌های ارتباط با دبیرخانه‌های حزب." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-brand">تماس</div>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">ارتباط با ما</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          برای همکاری، طرح پرسش یا ارتباط با دبیرخانه‌های حزب از راه‌های زیر
          می‌توانید اقدام کنید.
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card icon={<Mail className="h-5 w-5" />} title="ایمیل رسمی">
          nigp.hezb@gmail.com
        </Card>
        <Card icon={<Send className="h-5 w-5" />} title="کانال تلگرام">
          hezbnigp@
        </Card>
        <Card icon={<Instagram className="h-5 w-5" />} title="اینستاگرام">
          hezbnigp@
        </Card>
        <Card icon={<Youtube className="h-5 w-5" />} title="یوتیوب">
          hezbnigp@
        </Card>
      </div>
{/* 
      <form className="mt-10 grid gap-5 rounded-lg border border-border bg-card p-6 shadow-card md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-bold text-ink">نام</span>
          <input className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-bold text-ink">ایمیل یا تلگرام</span>
          <input className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </label>
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="font-bold text-ink">پیام شما</span>
          <textarea rows={5} className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </label>
        <div className="md:col-span-2">
          <button type="button" className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground hover:bg-brand/90">
            ارسال پیام
          </button>
        </div>
      </form> */}
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/10 text-brand">
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-sm font-bold text-ink">{children}</div>
        </div>
      </div>
    </div>
  );
}
