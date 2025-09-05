import { supabase } from "@/lib/supabase-client";

export async function createOrderInDB(userId: string, total: number) {
  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id: userId, total_amount: total }])
    .select("id")
    .single();

  if (error || !data)
    throw new Error(error?.message || "Failed to create order");
  return data.id as string;
}

export async function addOrderItems(
  orderId: string,
  items: { productId: string; price: number }[]
) {
  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    price: item.price,
  }));

  const { error } = await supabase.from("order_items").insert(orderItems);
  if (error) throw new Error(error.message);
}

export async function incrementProductDownloadCount(productId: string) {
  const { error } = await supabase.rpc("increment_download_count", {
    product_id: productId,
  });
  if (error) throw new Error(error.message);
}
