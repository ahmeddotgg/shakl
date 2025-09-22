import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useSignIn } from "@/modules/auth/hooks/use-auth";
import { Route } from "@/routes/auth/login";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(40),
});

export const LoginForm = () => {
  const { mutate, isPending } = useSignIn();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess: async () => {
        toast.success("Logged in successfully, you are being redirected");
        navigate({ to: redirect, reloadDocument: true });
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
          Login to your account
        </h2>
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <span className="sr-only absolute left-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
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
                  <span className="sr-only absolute left-0">
                    This is your public display name
                  </span>
                  <FormMessage className="absolute left-0 line-clamp-1 text-xs min-[520px]:text-sm" />
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
