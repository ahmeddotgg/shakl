import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
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
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const signature = req.headers["paddle-signature"] as string;

  try {
    const rawBody = (req as any).body?.toString?.() || "";
    if (!signature || !rawBody) {
      console.error("Missing signature or raw body");
      return res.status(400).send("Bad Request");
    }

    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      WEBHOOK_SECRET_KEY,
      signature
    );

    console.log(eventData.data);

    switch (eventData.eventType) {
      case "transaction.paid": {
        const transactionId = eventData.data.id;

        console.log(transactionId);
        const { data, error } = await supabaseAdmin
          .from("transactions")
          .update({ confirmed: true })
          .eq("id", transactionId);

        console.log("Supabase update:", { data, error });
        break;
      }

      default:
        console.log("Unhandled event:", eventData.eventType);
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }

  res.send("ok");
}
