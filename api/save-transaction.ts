import { createClient } from "@supabase/supabase-js";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { Database } from "../supabase/types";

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { checkout_id, user_id, payload, transaction_id, products } =
      req.body;

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .upsert({
        checkout_id,
        transaction_id,
        user_id,
        payload,
        products,
      })
      .select();

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create transaction" });
  }
}
