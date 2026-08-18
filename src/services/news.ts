import { supabase } from "@/lib/supabase";

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  secretariatSlug: string;
  secretariatName: string;
  publishedAt: string;
};

type NewsQueryRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
  secretariats:
    | {
        slug: string;
        name: string;
      }
    | {
        slug: string;
        name: string;
      }[]
    | null;
};

/**
 * اطلاعات دبیرخانه‌ای که همراه خبر از Supabase برمی‌گردد
 * را به یک ساختار ثابت تبدیل می‌کند.
 */
function getSecretariat(
  secretariats: NewsQueryRow["secretariats"],
): {
  slug: string;
  name: string;
} {
  if (!secretariats) {
    return {
      slug: "",
      name: "حزب",
    };
  }

  if (Array.isArray(secretariats)) {
    return {
      slug: secretariats[0]?.slug ?? "",
      name: secretariats[0]?.name ?? "حزب",
    };
  }

  return {
    slug: secretariats.slug,
    name: secretariats.name,
  };
}

/**
 * ساختار خام Supabase را به ساختار مورد استفاده UI تبدیل می‌کند.
 */
function mapNews(row: NewsQueryRow): NewsItem {
  const secretariat = getSecretariat(row.secretariats);

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.content,

    // فعلاً نام نویسنده را از profiles دریافت نمی‌کنیم.
    // در مرحله بعدی می‌توان relation مربوط به author را اضافه کرد.
    author: "",

    secretariatSlug: secretariat.slug,
    secretariatName: secretariat.name,

    publishedAt: row.published_at ?? "",
  };
}

/**
 * دریافت تمام اخبار منتشرشده
 */
export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats (
        slug,
        name
      )
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }

  return (data ?? []).map((row) => mapNews(row as NewsQueryRow));
}

/**
 * دریافت یک خبر بر اساس ID
 */
export async function getNewsById(
  id: string,
): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select(
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats (
        slug,
        name
      )
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch news item:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapNews(data as NewsQueryRow);
}

/**
 * دریافت اخبار یک دبیرخانه بر اساس slug
 */
export async function getNewsBySecretariat(
  slug: string,
): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats!inner (
        slug,
        name
      )
    )
    .eq("status", "published")
    .eq("secretariats.slug", slug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch secretariat news:", error);
    throw error;
  }

  return (data ?? []).map((row) => mapNews(row as NewsQueryRow));
}

/**
 * تبدیل تاریخ ISO به تاریخ فارسی
 */
export function formatDate(iso: string) {
  if (!iso) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}