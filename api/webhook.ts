import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";
import { Database, Json } from "../supabase/types";

const paddle = new Paddle(process.env.PADDLE_SECRET || "", {
  environment: Environment.sandbox,
});

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
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const signature = req.headers["paddle-signature"] as string;
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf-8");

  try {
    const event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );

    if (event.eventType === "transaction.paid") {
      const txn = event.data;
      const txnId = txn.id;

      await supabaseAdmin
        .from("transactions")
        .update({
          confirmed: true,
          payload: JSON.parse(JSON.stringify(event.data)) as Json,
        })
        .eq("transaction_id", txnId);

      console.log("✅ Confirmed transaction:", txnId);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ error: "Invalid signature or bad payload" });
  }
}
