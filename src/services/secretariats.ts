import { supabase } from "@/lib/supabase";

export type SecretariatMember = {
  id: string;
  name: string;
  role: string;
};

export type Secretariat = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  members: SecretariatMember[];
  displayOrder: number;
};

type SecretariatRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  logo_url: string | null;
  display_order: number;
};

function mapSecretariat(row: SecretariatRow): Secretariat {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logo: row.logo_url ?? "",
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    members: [],
    displayOrder: row.display_order,
  };
}

/**
 * دریافت تمام دبیرخانه‌های فعال
 */
export async function getSecretariats(): Promise<Secretariat[]> {
  const { data, error } = await supabase
    .from("secretariats")
    .select(`
      id,
      name,
      slug,
      description,
      tagline,
      logo_url,
      display_order
    `)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch secretariats:", error);
    throw error;
  }

  return (data ?? []).map((row) =>
    mapSecretariat(row as SecretariatRow),
  );
}

/**
 * دریافت یک دبیرخانه بر اساس slug
 */
export async function getSecretariatBySlug(
  slug: string,
): Promise<Secretariat | null> {
  const { data, error } = await supabase
    .from("secretariats")
    .select(`
      id,
      name,
      slug,
      description,
      tagline,
      logo_url,
      display_order
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch secretariat:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapSecretariat(data as SecretariatRow);
}

/**
 * دریافت اعضای یک دبیرخانه
 */
export async function getSecretariatMembers(
  secretariatId: string,
): Promise<SecretariatMember[]> {
  const { data, error } = await supabase
    .from("secretariat_members")
    .select(`
      id,
      position,
      profiles (
        id,
        full_name,
        username
      )
    `)
    .eq("secretariat_id", secretariatId)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to fetch secretariat members:", error);
    throw error;
  }

  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;

    return {
      id: row.id,
      name:
        profile?.full_name ||
        profile?.username ||
        "عضو دبیرخانه",
      role: row.position || "عضو",
    };
  });
}

/**
 * دریافت دبیرخانه به همراه اعضای آن
 */
export async function getSecretariatWithMembers(
  slug: string,
): Promise<Secretariat | null> {
  const secretariat = await getSecretariatBySlug(slug);

  if (!secretariat) {
    return null;
  }

  const members = await getSecretariatMembers(secretariat.id);

  return {
    ...secretariat,
    members,
  };
}