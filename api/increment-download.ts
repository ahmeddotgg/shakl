import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Database } from "../supabase/types";

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  const { error } = await supabaseAdmin.rpc("increment_product_download", {
    product_id: productId,
  });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
