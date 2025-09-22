import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PreferencesUpdate } from "~/supabase";
import { getUserPreferences, updateUserPreferences } from "../services";

export const usePreferences = (userId: string) => {
  return useQuery({
    queryKey: ["preferences", userId],
    queryFn: () => getUserPreferences(userId),
  });
};

export const useUpdatePreferences = (userId: string) => {
  return useMutation({
    mutationKey: ["update-preferences", userId],
    mutationFn: (payload: PreferencesUpdate) =>
      updateUserPreferences(userId, payload),
    onSuccess: () => toast.success("Profile Updated 🎉"),
  });
};
