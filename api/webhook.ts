import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Paddle, EventName, Environment } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";

const paddle = new Paddle(process.env.PADDLE_SECRET || "", {
  environment: Environment.sandbox,
});
const WEBHOOK_SECRET_KEY = process.env.PADDLE_WEBHOOK_SECRET || "";

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const signature = req.headers["paddle-signature"] as string;
    if (!signature) return res.status(400).send("Missing Paddle-Signature");

    // Collect raw body (needed for signature verification)
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) chunks.push(chunk as Uint8Array);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // Validate webhook
    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      WEBHOOK_SECRET_KEY,
      signature
    );

    switch (eventData.eventType) {
      case EventName.TransactionCompleted: {
        const tx = eventData.data;

        const { error } = await supabaseAdmin
          .from("transactions")
          .update({
            confirmed: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", tx.id);

        if (error) {
          console.error("DB update error:", error);
          return res.status(500).send("Failed to update transaction");
        }

        console.log("Transaction confirmed:", tx.id);
        break;
      }
      default:
        console.log("Unhandled event:", eventData.eventType);
    }

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("Webhook error:", err);
    res.status(400).send("Invalid webhook");
  }
}
