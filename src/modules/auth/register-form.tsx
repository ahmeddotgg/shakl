import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignUp } from "@/modules/auth/hooks/use-auth";
import { toast } from "sonner";
import { Route } from "@/routes/auth/register";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(40),
  email: z.email({ error: "Enter a valid email address" }),
  password: z.string().min(8).max(40),
});

export const RegisterForm = () => {
  const { mutate, isPending } = useSignUp();
  const { redirect } = Route.useSearch();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Verification email sent. Please check your inbox.");
        window.location.href = redirect;
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 font-semibold">
        <img alt="Shakl Logo" className="mb-4 size-10" src="/logoipsum.svg" />
        <h2 className="font-semibold text-2xl tracking-tight">
          Create New Account
        </h2>
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            search={{ redirect: "/" }}
            className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="sr-only left-0 absolute">
                    This is your public display name
                  </span>
                  <FormMessage className="left-0 absolute text-xs min-[520px]:text-sm line-clamp-1" />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="shadcn@example.co"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="relative">
                  <span className="sr-only left-0 absolute">
                    This is your public display name
                  </span>
                  <FormMessage className="left-0 absolute text-xs min-[520px]:text-sm line-clamp-1" />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*****" {...field} />
                </FormControl>
                <FormDescription className="relative">
                  <span className="sr-only left-0 absolute">
                    This is your public display name
                  </span>
                  <FormMessage className="left-0 absolute text-xs min-[520px]:text-sm line-clamp-1" />
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
