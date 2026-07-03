import { Link } from "@tanstack/react-router";
import { secretariats } from "@/data/secretariats";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-brand font-black">ن</div>
            <div>
              <div className="text-base font-bold">حزب ناسیونالیست بزرگ ایران</div>
              <div className="text-xs opacity-70">NIGP · Nationalist Iran Greatness Party</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 opacity-80">
            حزب ناسیونالیست بزرگ ایران با تکیه بر میراث تاریخی و فرهنگی ایران‌زمین،
            در پی طراحی راهبردی ملی برای آینده کشور است.
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-bold">پیوندها</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/charter" className="hover:text-brand">اساسنامه</Link></li>
            <li><Link to="/beliefs" className="hover:text-brand">عقاید</Link></li>
            <li><Link to="/news" className="hover:text-brand">اخبار</Link></li>
            <li><Link to="/membership" className="hover:text-brand">عضویت</Link></li>
            <li><Link to="/contact" className="hover:text-brand">ارتباط با ما</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-bold">دبیرخانه‌ها</div>
          <ul className="space-y-2 text-sm opacity-80">
            {secretariats.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/secretariats/$slug"
                  params={{ slug: s.slug }}
                  className="hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs opacity-60 sm:px-6">
          © {new Date().getFullYear()} حزب ناسیونالیست بزرگ ایران — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
