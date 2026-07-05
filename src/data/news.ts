export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  secretariatSlug: string;
  publishedAt: string; // ISO
};

export const news: NewsItem[] = [
  {
    id: "1",
    title: "فراخوان همکاری با دبیرخانه ادبیات",
    excerpt:
      "دبیرخانه ادبیات و فرهنگ از علاقه‌مندان به حوزه‌های فرهنگی، ادبی و هنری برای همکاری دعوت به عمل می‌آورد.",
    body: `دبیرخانه ادبیات و فرهنگ از علاقه‌مندان به حوزه‌های فرهنگی، ادبی و هنری برای همکاری دعوت به عمل می‌آورد.
در صورت تمایل به همکاری، در تلگرام به شناسه @Oopthw7 پیام دهید.`,
    author: "دبیرخانه ادبیات",
    secretariatSlug: "literature",
    publishedAt: "2026-06-28T10:00:00Z",
  },
/*   {
    id: "2",
    title: "نشست هفتگی دبیرخانه سیاست برگزار شد",
    excerpt:
      "در این نشست، تحولات منطقه‌ای و مواضع پیشنهادی حزب مورد بحث و بررسی قرار گرفت.",
    body: "گزارش کامل نشست به‌زودی منتشر خواهد شد.",
    author: "روابط عمومی",
    secretariatSlug: "politics",
    publishedAt: "2026-06-25T14:30:00Z",
  },
  {
    id: "3",
    title: "انتشار شماره جدید نشریه فرهنگی حزب",
    excerpt:
      "دبیرخانه ادبیات و فرهنگ شماره تازه نشریه داخلی خود را با محوریت پاسداشت زبان فارسی منتشر کرد.",
    body: "متن کامل معرفی نشریه در دست تهیه است.",
    author: "دبیرخانه ادبیات و فرهنگ",
    secretariatSlug: "literature",
    publishedAt: "2026-06-20T09:00:00Z",
  },
  {
    id: "4",
    title: "فراخوان همکاری با دبیرخانه رسانه",
    excerpt:
      "دبیرخانه رسانه از علاقه‌مندان به تولید محتوا برای همکاری دعوت به عمل می‌آورد.",
    body: "متقاضیان می‌توانند از طریق فرم عضویت اقدام کنند.",
    author: "دبیرخانه رسانه",
    secretariatSlug: "media",
    publishedAt: "2026-06-18T12:00:00Z",
  },
  {
    id: "5",
    title: "پژوهش تازه دبیرخانه تاریخ درباره دوره معاصر",
    excerpt: "بازخوانی روشمند بخشی از تاریخ معاصر ایران در قالب مقاله‌ای جامع.",
    body: "متن کامل مقاله در بخش پژوهش‌ها بارگذاری خواهد شد.",
    author: "دبیرخانه تاریخ",
    secretariatSlug: "history",
    publishedAt: "2026-06-15T08:00:00Z",
  },
  {
    id: "6",
    title: "اطلاعیه: زمان‌بندی مجمع عمومی سالانه",
    excerpt: "مجمع عمومی سالانه حزب در تاریخ اعلام‌شده برگزار خواهد شد.",
    body: "جزئیات کامل مجمع متعاقباً اعلام می‌شود.",
    author: "دبیرخانه اخبار",
    secretariatSlug: "news",
    publishedAt: "2026-06-10T11:00:00Z",
  }, */
];

export const announcements = news.slice(0, 3);

export function getNews(id: string) {
  return news.find((n) => n.id === id);
}

export function newsBySecretariat(slug: string) {
  return news.filter((n) => n.secretariatSlug === slug);
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
