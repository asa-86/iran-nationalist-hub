export type Secretariat = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  members: { name: string; role: string }[];
};

export const secretariats: Secretariat[] = [
  {
    slug: "news",
    name: "دبیرخانه اخبار",
    tagline: "روایت لحظه‌به‌لحظه رویدادها",
    description:
      "دبیرخانه اخبار وظیفه پوشش، تنظیم و انتشار رویدادهای مربوط به حزب و ایران را بر عهده دارد و نقطه اتصال میان بدنه حزب و افکار عمومی است.",
    members: [
      { name: "—", role: "دبیر" },
      { name: "—", role: "معاون دبیر" },
    ],
  },
  {
    slug: "media",
    name: "دبیرخانه رسانه",
    tagline: "صدای حزب در فضای عمومی",
    description:
      "این دبیرخانه سیاست‌های رسانه‌ای، تولید محتوا و حضور حزب در پلتفرم‌های ارتباطی را راهبری می‌کند.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "history",
    name: "دبیرخانه تاریخ",
    tagline: "بازخوانی روشمند گذشته ایران",
    description:
      "پژوهش، مستندسازی و انتشار مطالعات تاریخی با تکیه بر منابع دست‌اول و روش‌شناسی علمی.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "economy",
    name: "دبیرخانه اقتصاد",
    tagline: "اقتصاد ملی، توسعه پایدار",
    description:
      "تحلیل شاخص‌ها، تدوین سیاست‌های اقتصادی حزب و ارائه راهکارهای عملی برای توسعه اقتصادی ایران.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "politics",
    name: "دبیرخانه سیاست",
    tagline: "اندیشه سیاسی و راهبرد ملی",
    description:
      "بررسی مسائل داخلی و بین‌المللی، تدوین مواضع سیاسی و طراحی راهبردهای حکمرانی از منظر ملی‌گرایی ایرانی.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "sociology",
    name: "دبیرخانه جامعه‌شناسی",
    tagline: "شناخت جامعه ایرانی",
    description:
      "پژوهش در ساختارهای اجتماعی، فرهنگ عمومی و تحولات جامعه ایرانی برای طراحی سیاست‌های اجتماعی حزب.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "philosophy",
    name: "دبیرخانه فلسفه و منطق",
    tagline: "پایه‌های فکری حزب",
    description:
      "بازاندیشی در مبانی فلسفی ناسیونالیسم ایرانی، منطق سیاسی و پرورش تفکر انتقادی در بدنه حزب.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "literature",
    name: "دبیرخانه ادبیات و فرهنگ",
    tagline: "پاسداشت زبان و میراث",
    description:
      "حفظ و ترویج زبان فارسی، ادبیات کلاسیک و معاصر و میراث فرهنگی ایران‌زمین.",
    members: [{ name: "—", role: "دبیر" }],
  },
  {
    slug: "militarism",
    name: "دبیرخانه میلیتاریسم",
    tagline: "امنیت و اقتدار ملی",
    description:
      "مطالعه دکترین دفاعی، تاریخ نظامی ایران و راهبردهای امنیت ملی از منظر ناسیونالیستی.",
    members: [{ name: "—", role: "دبیر" }],
  },
];

export function getSecretariat(slug: string) {
  return secretariats.find((s) => s.slug === slug);
}
