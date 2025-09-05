import { Loader } from "lucide-react";

export const Loading = () => {
  return (
    <div className="place-content-center grid w-full min-h-svh container">
      <div className="bg-card p-4 sm:p-8 md:p-16 border-2 rounded-2xl">
        <Loader className="size-16 animate-spin" />
      </div>
    </div>
  );
};
