import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/types";

const supabase = createClient<Database>(
  "https://lftazpssdwbbexxecvff.supabase.co",
  "sb_secret_uw4rAby_UQQMfr52s79m9A_NIbeYZDH"
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { transaction, user_id } = req.body;

    if (!transaction?.id || !user_id) {
      return res
        .status(400)
        .json({ error: "Missing transaction id or user_id" });
    }
    const { error } = await supabase.from("transactions").upsert(
      {
        id: transaction.id,
        user_id,
        payload: transaction,
      },
      { onConflict: "id" }
    );
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create transaction" });
  }
}
