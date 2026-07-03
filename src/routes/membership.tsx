import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "درخواست عضویت — حزب ناسیونالیست بزرگ ایران" },
      { name: "description", content: "فرم رسمی درخواست عضویت در حزب." },
    ],
  }),
  component: Membership,
});

function Membership() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    // NOTE: در فاز بعد به بک‌اند متصل می‌شود.
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
          <h1 className="mt-4 text-2xl font-black text-ink">درخواست شما ثبت شد</h1>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            درخواست عضویت شما با موفقیت ثبت شد و در حال حاضر در وضعیت
            <span className="mx-1 rounded bg-muted px-2 py-0.5 font-bold text-ink">در انتظار بررسی</span>
            قرار دارد. نتیجه از طریق آیدی تلگرام به شما اطلاع داده می‌شود.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-brand">پیوستن به حزب</div>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">درخواست عضویت</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          پس از ثبت فرم، درخواست شما هم‌زمان برای رهبر حزب، قائم‌مقام، معاون کل،
          مسئول عضوگیری و برنامه‌نویس سایت ارسال می‌شود. هر کدام زودتر تأیید کنند،
          عضویت شما رسمیت می‌یابد.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5 rounded-lg border border-border bg-card p-6 shadow-card md:grid-cols-2">
        <Field label="نام یا لقب" name="name" required />
        <Field label="سن" name="age" type="number" required />
        <Field label="مدرک تحصیلی" name="education" required />
        <Field label="آیدی تلگرام" name="telegram" placeholder="@username" required />
        <TextArea label="مهارت‌ها و استعدادها" name="skills" required />
        <TextArea label="علاقه‌مندی‌ها" name="interests" required />
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground shadow-soft hover:bg-brand/90"
          >
            ثبت درخواست عضویت
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function TextArea({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2 text-sm md:col-span-2">
      <span className="font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={3}
        className="resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
