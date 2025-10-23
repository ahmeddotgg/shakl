import { supabase } from "~/supabase/index";

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.SERVER_URL,
      data: {
        name: name,
      },
    },
  });

  // save basic preferences
  const { error: preferencesError } = await supabase
    .from("preferences")
    .insert({ first_name: name });

  if (error || preferencesError) throw error;
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
