import { supabase } from "@/lib/supabase";
export type { NewsItem } from "@/data/news";
import type { NewsItem } from "@/data/news";

type NewsQueryRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
  secretariats:
    | {
        slug: string;
      }
    | {
        slug: string;
      }[]
    | null;
};

function getSecretariatSlug(
  secretariats: NewsQueryRow["secretariats"],
): string {
  if (!secretariats) {
    return "";
  }

  if (Array.isArray(secretariats)) {
    return secretariats[0]?.slug ?? "";
  }

  return secretariats.slug;
}

function mapNews(row: NewsQueryRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.content,
    // فعلاً author در schema فعلی NewsItem وجود دارد
    // ولی در جدول news هنوز به آن متصل نشده‌ایم.
    author: "",
    secretariatSlug: getSecretariatSlug(row.secretariats),
    publishedAt: row.published_at ?? "",
  };
}

/**
 * دریافت تمام اخبار منتشرشده
 */
export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(`
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats (
        slug
      )
    `)
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
    .select(`
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats (
        slug
      )
    `)
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
 * دریافت اخبار یک دبیرخانه
 */
export async function getNewsBySecretariat(
  slug: string,
): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(`
      id,
      title,
      excerpt,
      content,
      published_at,
      secretariats!inner (
        slug
      )
    `)
    .eq("status", "published")
    .eq("secretariats.slug", slug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch secretariat news:", error);
    throw error;
  }

  return (data ?? []).map((row) => mapNews(row as NewsQueryRow));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}