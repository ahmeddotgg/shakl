import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, User2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import type { FileUploadProps } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "../auth/hooks/use-auth";
import { ImagesUploader } from "../products/images-uploader";
import { imageUpload } from "../products/services";
import { usePreferences, useUpdatePreferences } from "./hooks/use-preferences";

const prefrencesFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string(),
});

type PrefrencesFormInput = z.infer<typeof prefrencesFormSchema>;

export function PrefrencesForm() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const [resetFiles, setResetFiles] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useUser();
  if (!user) return;
  if (userLoading) return <Loading />;

  const { data } = usePreferences(user.id);
  const { mutate: updatePreferences, isPending } = useUpdatePreferences(
    user.id,
  );

  const form = useForm<PrefrencesFormInput>({
    resolver: zodResolver(prefrencesFormSchema),
    values: {
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      avatar_url: data?.avatar_url || "",
    },
  });

  const {
    formState: { isDirty },
  } = form;

  const handleSubmit = async (data: PrefrencesFormInput) => {
    try {
      updatePreferences(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["preferences"] });
          form.reset();
        },
      });

      if (avatarRef.current) {
        avatarRef.current.classList.remove("pointer-events-none", "opacity-50");
        avatarRef.current.setAttribute("aria-disabled", "false");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Somthing went worng!";
      toast.error(errorMessage);
    }
  };

  const onAvatarUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            onProgress(file, 20);
            const url = await imageUpload(file);
            if (!url) return toast.error("Error uploading!");

            onProgress(file, 100);
            onSuccess(file);

            if (avatarRef.current) {
              avatarRef.current.classList.add(
                "pointer-events-none",
                "opacity-50",
              );
              avatarRef.current.setAttribute("aria-disabled", "true");
            }

            setResetFiles(true);
            form.setValue("avatar_url", url, { shouldDirty: true });
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed"),
            );
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [form.setValue],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <section className="space-y-2 rounded-md bg-card/70 p-4 *:min-w-full">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="absolute left-0 opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="space-y-2" ref={avatarRef}>
            <FormLabel>Avatar</FormLabel>
            <ImagesUploader
              error={form.formState.errors.avatar_url?.message}
              max={1}
              multiable={false}
              onUpload={onAvatarUpload}
              reset={resetFiles}
            />
          </div>
          <Button type="submit" disabled={isPending || !isDirty} size="lg">
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Save className="size-5" />
                Save
              </>
            )}
          </Button>
        </section>

        <section className="flex flex-col items-center justify-center gap-6 rounded-md bg-card/70 p-4 text-center">
          <div className="size-40 content-center overflow-hidden rounded-full bg-secondary">
            {data?.avatar_url ? (
              <img
                className="block size-full object-cover"
                src={data.avatar_url}
                alt="Avatar"
              />
            ) : (
              <User2 className="mx-auto size-14" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-2xl">
              {data?.first_name} {data?.last_name}
            </h2>
            <h2 className="font-semibold text-muted-foreground text-sm">
              {user.email}
            </h2>
          </div>
        </section>
      </form>
    </Form>
  );
}
