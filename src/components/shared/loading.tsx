import { Loader } from "lucide-react";

export const Loading = () => {
  return (
    <div className="container grid min-h-svh w-full place-content-center">
      <div className="rounded-2xl border-2 bg-card p-4 sm:p-8 md:p-16">
        <Loader className="size-16 animate-spin" />
      </div>
    </div>
  );
};
