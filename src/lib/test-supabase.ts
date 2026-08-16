import { supabase } from "@/lib/supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("secretariats")
    .select("id, name, slug, display_order")
    .order("display_order");

  console.log("Supabase secretariats:", data);

  if (error) {
    console.error("Supabase error:", error);
  }

  return { data, error };
}
