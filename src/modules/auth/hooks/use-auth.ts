import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, signIn, signUp, signOut } from "@/modules/auth/services";
import { supabase } from "~/supabase/index";

const USER_KEY = ["auth", "user", "session"];

export function useUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getUser,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: USER_KEY });
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEY }),
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => signUp(email, password, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEY }),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEY }),
  });
}
