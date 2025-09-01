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
import { useSignIn } from "@/hooks/use-auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(40),
});

export const LoginForm = () => {
  const { mutate, isPending } = useSignIn();
  const { navigate } = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        navigate({ href: "/" });
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
          <Link to="/register" className="text-blue-600">
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
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
