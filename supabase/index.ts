import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "./types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type Product = Tables<"products">;
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export type Category = Tables<"product_categories">;
export type FileType = Tables<"file_types">;

export type ProductView = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  thumbnail_url: string;
  created_at: string | null;
  download_count: number | null;
  category: string;
  file_type: string;
};

export type RawTransaction = Tables<"transactions">;
export interface TransactionProduct {
  id: string;
  title: string;
  file_url: string;
  thumbnail_url: string;
}

export type Transaction = Omit<RawTransaction, "products"> & {
  products: TransactionProduct[] | null;
};

export type PreferencesUpdate =
  Database["public"]["Tables"]["preferences"]["Update"];
