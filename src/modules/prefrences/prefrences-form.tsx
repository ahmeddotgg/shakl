import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ImagesUploader } from "../products/images-uploader";

const prefrencesFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
});

type PrefrencesFormInput = z.infer<typeof prefrencesFormSchema>;

export function PrefrencesForm() {
  const form = useForm<PrefrencesFormInput>({
    resolver: zodResolver(prefrencesFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatar: "",
    },
  });

  const handleSubmit = (data: PrefrencesFormInput) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="gap-2 grid grid-cols-2 [&>*]:min-w-full">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="left-0 absolute opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="left-0 absolute text-xs min-[520px]:text-sm line-clamp-1" />
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="left-0 absolute opacity-0">
                    This is your public display name
                  </span>
                  <FormMessage className="left-0 absolute text-xs min-[520px]:text-sm line-clamp-1" />
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1 space-y-2">
          <FormLabel>Avatar</FormLabel>
          <ImagesUploader
            error={form.formState.errors.avatar?.message}
            max={1}
            multiable={false}
            onUpload={() => {}}
            reset={false}
          />
        </div>
      </form>
    </Form>
  );
}
