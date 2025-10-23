import { type PreferencesUpdate, supabase } from "~/supabase";

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserPreferences = async (
  userId: string,
  payload: PreferencesUpdate,
) => {
  const { first_name, last_name, avatar_url } = payload;

  const { error } = await supabase
    .from("preferences")
    .update({ first_name, last_name, avatar_url })
    .eq("user_id", userId);

  if (error) throw error;
};
