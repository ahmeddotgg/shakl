import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "./types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export type Product = Tables<"products">;
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
