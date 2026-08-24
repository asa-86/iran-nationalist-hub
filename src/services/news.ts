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

function mapNews(row: NewsQueryRow): NewsItem {
  const secretariat = getSecretariat(row.secretariats);

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.content,
    author: "",
    secretariatSlug: secretariat.slug,
    secretariatName: secretariat.name,
    publishedAt: row.published_at ?? "",
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,excerpt,content,published_at,secretariats(slug,name)",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }

  return (data ?? []).map((row) =>
    mapNews(row as NewsQueryRow),
  );
}

export async function getNewsById(
  id: string,
): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,excerpt,content,published_at,secretariats(slug,name)",
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

export async function getNewsBySecretariat(
  slug: string,
): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,excerpt,content,published_at,secretariats!inner(slug,name)",
    )
    .eq("status", "published")
    .eq("secretariats.slug", slug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch secretariat news:", error);
    throw error;
  }

  return (data ?? []).map((row) =>
    mapNews(row as NewsQueryRow),
  );
}

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

export type CreateNewsInput = {
  title: string;
  excerpt: string;
  content: string;
  secretariatId: string | null;
  categoryId?: string | null;
  status?: "draft" | "pending_review" | "published";
};

export type CreatedNews = {
  id: string;
  slug: string;
  status: string;
};

function createSlug(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const randomPart = crypto.randomUUID().slice(0, 8);

  return `${base || "news"}-${randomPart}`;
}

export async function createNews(
  input: CreateNewsInput,
): Promise<CreatedNews> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("برای افزودن خبر باید وارد حساب شوید.");
  }

  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();

  if (!title) {
    throw new Error("عنوان خبر الزامی است.");
  }

  if (!content) {
    throw new Error("متن خبر الزامی است.");
  }

  const status = input.status ?? "draft";

  const { data, error } = await supabase
    .from("news")
    .insert({
      title,
      slug: createSlug(title),
      excerpt: excerpt || null,
      content,
      author_id: user.id,
      secretariat_id: input.secretariatId,
      category_id: input.categoryId ?? null,
      status,
      published_at:
        status === "published"
          ? new Date().toISOString()
          : null,
    })
    .select("id, slug, status")
    .single();

  if (error) {
    console.error("Failed to create news:", error);
    throw error;
  }

  return data as CreatedNews;
}

export type ManagedNewsStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected";

export type ManagedNewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: ManagedNewsStatus;
  rejectionReason: string | null;
  secretariatId: string | null;
  secretariatName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

type ManagedNewsRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: ManagedNewsStatus;
  rejection_reason: string | null;
  secretariat_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  secretariats:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

function getManagedSecretariatName(
  secretariats: ManagedNewsRow["secretariats"],
) {
  if (!secretariats) {
    return "بدون دبیرخانه";
  }

  if (Array.isArray(secretariats)) {
    return secretariats[0]?.name ?? "بدون دبیرخانه";
  }

  return secretariats.name;
}

function mapManagedNews(
  row: ManagedNewsRow,
): ManagedNewsItem {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    status: row.status,
    rejectionReason: row.rejection_reason,
    secretariatId: row.secretariat_id,
    secretariatName: getManagedSecretariatName(
      row.secretariats,
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

export async function getMyNews(): Promise<
  ManagedNewsItem[]
> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("کاربر وارد حساب نشده است.");
  }

  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,excerpt,content,status,rejection_reason,secretariat_id,created_at,updated_at,published_at,secretariats(name)",
    )
    .eq("author_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch user news:",
      error,
    );
    throw error;
  }

  return (data ?? []).map((row) =>
    mapManagedNews(row as ManagedNewsRow),
  );
}

export async function getMyNewsById(
  id: string,
): Promise<ManagedNewsItem | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("کاربر وارد حساب نشده است.");
  }

  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,excerpt,content,status,rejection_reason,secretariat_id,created_at,updated_at,published_at,secretariats(name)",
    )
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch user news item:",
      error,
    );
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapManagedNews(
    data as ManagedNewsRow,
  );
}

export type UpdateOwnNewsInput = {
  title: string;
  excerpt: string;
  content: string;
  secretariatId: string | null;
};

export async function updateOwnNews(
  id: string,
  input: UpdateOwnNewsInput,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("کاربر وارد حساب نشده است.");
  }

  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();

  if (!title) {
    throw new Error("عنوان خبر الزامی است.");
  }

  if (!content) {
    throw new Error("متن خبر الزامی است.");
  }

  const { error } = await supabase
    .from("news")
    .update({
      title,
      excerpt: excerpt || null,
      content,
      secretariat_id: input.secretariatId,
    })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    console.error(
      "Failed to update news:",
      error,
    );
    throw error;
  }
}

export async function submitNewsForReview(
  id: string,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("کاربر وارد حساب نشده است.");
  }

  const { error } = await supabase
    .from("news")
    .update({
      status: "pending_review",
    })
    .eq("id", id)
    .eq("author_id", user.id)
    .in("status", ["draft", "rejected"]);

  if (error) {
    console.error(
      "Failed to submit news for review:",
      error,
    );
    throw error;
  }
}