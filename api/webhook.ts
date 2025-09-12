import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";

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

    console.log("Signature:", signature);
    console.log("Raw body:", rawBody);
    console.log(event.data);

    if (event.eventType === "transaction.paid") {
      const { data, error } = await supabaseAdmin
        .from("transactions")
        .update({ confirmed: true })
        .eq("id", event.data.id);

      console.log("Supabase response:", { data, error });
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook error:", err);
  }

  res.send("ok");
}
