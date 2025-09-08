import { supabase, type Product } from "~/supabase/index";

export async function createOrder(userId: string, total: number) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: total,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function addOrderItems(orderId: string, items: Product[]) {
  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    price: item.price,
  }));

  const { error } = await supabase.from("order_items").insert(orderItems);
  if (error) throw new Error(error.message);
}

export async function createPaymentSession(
  amount: number,
  products: Product[]
) {
  const { data, error } = await supabase.functions.invoke("paymob", {
    body: { amount, products },
  });
  if (error) {
    throw new Error("Failed to create payment session");
  }

  if (!data?.iframeUrl) {
    throw new Error("Missing iframeUrl from server");
  }

  return data.iframeUrl;
}
