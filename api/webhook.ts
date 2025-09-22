import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Database } from "../supabase/types";

const paddle = new Paddle(process.env.PADDLE_SECRET || "", {
  environment: Environment.sandbox,
});

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", (err) => reject(err));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const signature = (req.headers["paddle-signature"] as string) || "";
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

  try {
    const rawRequestBody = await getRawBody(req);
    if (signature && secretKey) {
      const event = await paddle.webhooks.unmarshal(
        rawRequestBody,
        process.env.PADDLE_WEBHOOK_SECRET || "",
        signature,
      );

      if (event.eventType === EventName.TransactionCompleted) {
        // 1: update transaction with confirmed
        const { error: updateError } = await supabaseAdmin
          .from("transactions")
          .update({ status: "confirmed" })
          .eq("transaction_id", event.data.id);

        if (updateError) {
          console.error("Error updating transaction status:", updateError);
          return res
            .status(500)
            .json({ error: "Failed to update transaction status" });
        }

        // 2: get products from transaction
        const { data: getTxnProducts, error: getProductsError } =
          await supabaseAdmin
            .from("transactions")
            .select("products")
            .eq("transaction_id", event.data.id)
            .single();

        if (getProductsError || !getTxnProducts) {
          console.error(
            "Error fetching transaction products:",
            getProductsError,
          );
          return res
            .status(500)
            .json({ error: "Failed to fetch transaction products" });
        }

        // 3: map over products and get each id
        const productIds = (
          (getTxnProducts?.products as { id: string }[]) ?? []
        ).map((p) => p.id);

        // 4: get the real product info based on id
        const { data: realProducts, error: realProductsError } =
          await supabaseAdmin
            .from("products")
            .select("id, title, file_url, thumbnail_url")
            .in("id", productIds);

        if (realProductsError) {
          console.error("Error fetching real products:", realProductsError);
          return res
            .status(500)
            .json({ error: "Failed to fetch real product info" });
        }

        // 5: update the transaction products with final info
        const { error: finalUpdateError } = await supabaseAdmin
          .from("transactions")
          .update({ products: realProducts })
          .eq("transaction_id", event.data.id);

        if (finalUpdateError) {
          console.error(
            "Error updating transaction with final products:",
            finalUpdateError,
          );
          return res
            .status(500)
            .json({ error: "Failed to update transaction products" });
        }

        return res
          .status(200)
          .json({ message: "Transaction confirmed and products updated" });
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res
      .status(500)
      .json(
        error instanceof Error
          ? error.message
          : "Invalid signature or bad payload",
      );
  }
}
