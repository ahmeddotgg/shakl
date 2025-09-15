import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/types";

export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export interface PaddleProduct {
  id: string;
  title: string;
  quantity: number;
}

export interface PaddleTransaction {
  id: string;
  createdAt: string; // ISO string
  status: string;
  products: PaddleProduct[]; // product items + quantity
  amount: number; // major units (e.g. 652.15)
  currency: string; // e.g. "USD"
  method: string; // e.g. "VISA •••• 3184" or "card"
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = (req.query.userId as string) || undefined;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1) fetch transaction ids from your DB (assumes your DB column is `transaction_id`)
    const { data: dbRows, error: dbError } = await supabaseAdmin
      .from("transactions")
      .select("transaction_id")
      .eq("user_id", userId);

    if (dbError) throw dbError;
    if (!dbRows || dbRows.length === 0) return res.status(200).json([]);

    // 2) fetch each transaction from Paddle and normalize
    const results = await Promise.all(
      dbRows.map(async (row) => {
        const transactionId = (row as any).transaction_id;
        if (!transactionId) return null;

        try {
          const paddleRes = await fetch(
            `https://api.paddle.com/transactions/${transactionId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!paddleRes.ok) {
            // return minimal fallback object so client knows the id existed
            return {
              id: transactionId,
              createdAt: new Date().toISOString(),
              status: "fetch_failed",
              products: [],
              amount: 0,
              currency: "USD",
              method: "unknown",
            } as PaddleTransaction;
          }

          const json = await paddleRes.json();
          const d = json.data ?? {};

          // pick items from top-level `items` or nested `details.line_items`
          const items = Array.isArray(d.items)
            ? d.items
            : Array.isArray(d.details?.line_items)
            ? d.details.line_items
            : [];

          const products = items.map((it: any, i: number) => ({
            id: it.product?.id ?? it.product_id ?? `prod-${i}`,
            title: it.product?.name ?? it.product?.title ?? "Untitled",
            quantity:
              typeof it.quantity === "number"
                ? it.quantity
                : Number(it.quantity ?? 1),
          }));

          // prefer details.totals.grand_total, fallback to totals.total etc.
          const grand =
            d.details?.totals?.grand_total ??
            d.details?.totals?.total ??
            d.totals?.total ??
            d.totals?.grand_total ??
            d.details?.totals?.total ??
            null;

          let amount = 0;
          let currency =
            d.details?.totals?.currency_code ?? d.currency_code ?? "USD";

          if (grand != null) {
            // Paddle returns amounts as integer minor units in strings (e.g. "65215")
            const minor =
              typeof grand === "string" ? Number(grand) : Number(grand);
            amount = Number.isFinite(minor) ? minor / 100 : 0;
          }

          // pick a payment method (prefer captured / successful if present)
          const payments: any[] = Array.isArray(d.payments)
            ? d.payments
            : d.payments
            ? [d.payments]
            : [];
          const preferredPayment =
            payments.find((p) => p.status === "captured") ??
            payments[0] ??
            null;
          let method = "unknown";

          if (preferredPayment) {
            const md =
              preferredPayment.method_details ??
              preferredPayment.methodDetails ??
              {};
            if (md.type === "card" && md.card) {
              const cardType = (md.card.type ?? "").toUpperCase();
              const last4 = md.card.last4 ?? md.card?.last_4 ?? "xxxx";
              method = `${cardType} •••• ${last4}`;
            } else {
              method = md.type ?? "unknown";
            }
          }

          const normalized: PaddleTransaction = {
            id: d.id ?? transactionId,
            createdAt: d.created_at ?? d.createdAt ?? new Date().toISOString(),
            status: d.status ?? "unknown",
            products,
            amount,
            currency,
            method,
          };

          return normalized;
        } catch (err) {
          // per-transaction failure: return a minimal object
          return {
            id: transactionId,
            createdAt: new Date().toISOString(),
            status: "fetch_failed",
            products: [],
            amount: 0,
            currency: "USD",
            method: "unknown",
          } as PaddleTransaction;
        }
      })
    );

    const filtered = results.filter(Boolean);
    return res.status(200).json(filtered);
  } catch (err: any) {
    console.error("get-transactions error:", err);
    return res
      .status(500)
      .json({ error: err.message ?? "Internal server error" });
  }
}
