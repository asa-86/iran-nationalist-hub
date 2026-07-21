import newsLogo from "/اخبار.jpg";
import mediaLogo from "/رسانه.jpg";
import historyLogo from "/تاریخ.jpg";
import economyLogo from "/اقتصاد.jpg";
import politicsLogo from "/سیاست.jpg";
import philosophyLogo from "/فلسفه.jpg";
import literatureLogo from "/ادبیات.jpg";
import militarismLogo from "/میلیتاریسم.jpg";

export type Secretariat = {
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  members: { name: string; role: string }[];
};

export const secretariats: Secretariat[] = [
  {
    slug: "news",
    name: "دبیرخانه رسانه و اخبار",
    logo:newsLogo,
    tagline: "صدای حزب در فضای عمومی",
    description:
      "این دبیرخانه سیاست‌های رسانه‌ای، تولید محتوا و حضور حزب در پلتفرم‌های ارتباطی را راهبری می‌کند.",
    members: [
      { name: "عَصـا ¦ 𝙰𝚂𝙰", role: "دبیر" },
      { name: "Tondro", role: "معاون اخبار" },
      { name: "Qt", role: "معاون رسانه" },
    ],
  },
/*   {
    slug: "media",
    name: "دبیرخانه رسانه",
    logo: mediaLogo,
    tagline: "صدای حزب در فضای عمومی",
    description:
      "این دبیرخانه سیاست‌های رسانه‌ای، تولید محتوا و حضور حزب در پلتفرم‌های ارتباطی را راهبری می‌کند.",
    members: [{ name: "satoru gojo", role: "دبیر" }],
  }, */
  {
    slug: "history",
    name: "دبیرخانه تاریخ",
    logo: historyLogo,
    tagline: "بازخوانی روشمند گذشته ایران",
    description:
      "پژوهش، مستندسازی و انتشار مطالعات تاریخی با تکیه بر منابع دست‌اول و روش‌شناسی علمی.",
    members: [
      { name: "A.R", role: "دبیر" },
      { name: "S M", role: "معاون دبیر" },

    ],
  },
  {
    slug: "economy",
    name: "دبیرخانه اقتصاد",
    logo: economyLogo,
    tagline: "اقتصاد ملی، توسعه پایدار",
    description:
      "تحلیل شاخص‌ها، تدوین سیاست‌های اقتصادی حزب و ارائه راهکارهای عملی برای توسعه اقتصادی ایران.",
    members: [{ name: "دکتر خسروشاهی", role: "دبیر" }],
  },
  {
    slug: "politics",
    name: "دبیرخانه سیاسی و جامعه‌شناسی",
    logo: politicsLogo,
    tagline: "اندیشه سیاسی و راهبرد ملی",
    description:
      "بررسی مسائل داخلی و بین‌المللی، تدوین مواضع سیاسی و طراحی راهبردهای حکمرانی از منظر ملی‌گرایی ایرانی.",
    members: [
      { name: "Mirage", role: "دبیر" },
      { name: "دشتي", role: "معاون دبیر" },    
    ],
  },
  {
    slug: "philosophy",
    name: "دبیرخانه فلسفه و منطق",
    logo: philosophyLogo,
    tagline: "پایه‌های فکری حزب",
    description:
      "بازاندیشی در مبانی فلسفی ناسیونالیسم ایرانی، منطق سیاسی و پرورش تفکر انتقادی در بدنه حزب.",
    members: [{ name: "Mr. Gold Coin", role: "دبیر" },
/*       { name: "Mr. Gold Coin", role: "معاون دبیر" } */],
  },
  {
    slug: "literature",
    name: "دبیرخانه ادبیات و فرهنگ",
    logo: literatureLogo,
    tagline: "پاسداشت زبان و میراث",
    description:
      "حفظ و ترویج زبان فارسی، ادبیات کلاسیک و معاصر و میراث فرهنگی ایران‌زمین.",
    members: [{ name: "MADARA", role: "دبیر" }],
  },
  {
    slug: "militarism",
    name: "دبیرخانه میلیتاریسم",
    logo: militarismLogo,
    tagline: "امنیت و اقتدار ملی",
    description:
      "مطالعه دکترین دفاعی، تاریخ نظامی ایران و راهبردهای امنیت ملی از منظر ناسیونالیستی.",
    members: [{ name: "محمدحسین اصفهانی", role: "دبیر" },
/*       { name: "محمدحسین اصفهانی", role: "معاون دبیر" }, */],
  },
];

export function getSecretariat(slug: string) {
  return secretariats.find((s) => s.slug === slug);
}
