import { supabase } from "@/lib/supabase";

export interface Secretariat {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  display_order: number;
  is_active: boolean;
}

export async function getSecretariats(): Promise<Secretariat[]> {
  const { data, error } = await supabase
    .from("secretariats")
    .select(
      "id, name, slug, tagline, description, logo_url, display_order, is_active"
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch secretariats:", error);
    throw error;
  }

  return data ?? [];
}