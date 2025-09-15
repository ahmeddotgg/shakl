import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";
import {
  Environment,
  Paddle,
  Transaction,
  TransactionCollection,
} from "@paddle/paddle-node-sdk";

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const paddle = new Paddle(process.env.PADDLE_SECRET || "", {
  environment: Environment.sandbox,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = (req.query.userId as string) || undefined;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1) get customer id from latest transaction
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("payload")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // ensure latest
      .limit(1)
      .single();
    if (error || !data) {
      throw new Error("No transaction found for user: " + userId);
    }
    const payload = data.payload as unknown as Transaction;
    const customerId = payload.customer?.id;
    if (!customerId) {
      throw new Error("Customer ID not found in payload");
    }

    // 2) fetch all transactions for that customer
    const transactionCollection: TransactionCollection =
      paddle.transactions.list({
        customerId: [customerId as string],
      });

    const transactions: Transaction[] = [];

    do {
      const page = await transactionCollection.next();
      transactions.push(...page);
    } while (transactionCollection.hasMore);

    const minTransaction = transactions.map((t) => ({
      id: t.id,
      status: t.status,
      createdAt: t.createdAt,

      paymentMethod:
        t.payments.length > 0 ? t.payments[0].methodDetails?.type : "none",

      totals: {
        subtotal: t.details?.totals?.subtotal ?? "0",
        tax: t.details?.totals?.tax ?? "0",
        total: t.details?.totals?.total ?? "0",
        grandTotal: t.details?.totals?.grandTotal ?? "0",
        earnings: t.details?.totals?.earnings ?? "0",
        currencyCode: t.details?.totals?.currencyCode ?? t.currencyCode,
      },

      items:
        t.details?.lineItems?.map((li) => ({
          id: li.id,
          productId: li.product?.id ?? "",
          name: li.product?.name ?? "Unknown",
          quantity: li.quantity,
          subtotal: li.totals?.subtotal ?? "0",
          tax: li.totals?.tax ?? "0",
          total: li.totals?.total ?? "0",
          imageUrl: li.product?.imageUrl ?? null,
        })) ?? [],
    }));

    return res.status(200).json({
      total: transactions.length,
      transactions: minTransaction,
    });
  } catch (err: any) {
    console.error("get-transactions error:", err);
    return res
      .status(500)
      .json({ error: err.message ?? "Internal server error" });
  }
}
