import { supabase } from "~/supabase/index";

export async function getOrdersHistory(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}
